import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween.js';
import Employee from '../models/Employee.js';
import Leave from '../models/Leave.js';
import Attendance from '../models/Attendance.js';
import Holiday from '../models/Holiday.js';
import MonthlyCTC from '../models/MonthlyCTC.js';
import { applyRounding } from './rounding.js';

dayjs.extend(isBetween);

export function daysInMonth(year, month) {
  return dayjs(`${year}-${String(month).padStart(2, '0')}-01`).daysInMonth();
}

export function perDayRate(monthlyGross, workingDays) {
  return monthlyGross / Math.max(workingDays, 1);
}

function computeWorkingDays(year, month, workDaysPerWeek) {
  const totalDays = daysInMonth(year, month);
  let workingDays = 0;

  for (let d = 1; d <= totalDays; d++) {
    const date = dayjs(`${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    const dow = date.day(); // 0 = Sun ... 6 = Sat

    if (workDaysPerWeek === 5) {
      if (dow >= 1 && dow <= 5) workingDays++;
    } else {
      if (dow !== 0) workingDays++; // 6-day week
    }
  }
  return workingDays;
}

function sum(values) {
  return values.reduce((a, b) => a + b, 0);
}

export async function ensureMonthlyCTCSnapshot(emp, year, month) {
  const existing = await MonthlyCTC.findOne({ employee: emp._id, year, month });
  if (existing) return existing;

  const monthlyCTC = emp.ctc / 12;
  return await MonthlyCTC.create({
    employee: emp._id,
    year,
    month,
    monthlyCTC,
    snapshot: emp.payStructure,
  });
}

export async function calculateEmployeePayroll(emp, { year, month }) {
  const monthlyCTC = emp.ctc / 12;
  await ensureMonthlyCTCSnapshot(emp, year, month);

  // Base components
  const baseComponents = {};
  let grossEarningsPlanned = 0;
  let grossDeductionsPlanned = 0;

  for (const c of emp.payStructure.components) {
    let amount = 0;

    if (c.calc.method === 'pct_of_base') amount = (monthlyCTC * c.calc.value) / 100;
    else if (c.calc.method === 'pct_of_ctc') amount = (emp.ctc * c.calc.value) / (100 * 12);
    else if (c.calc.method === 'fixed') amount = c.calc.value;

    if (c.monthlyCap) amount = Math.min(amount, c.monthlyCap);
    amount = applyRounding(amount, c.rounding);

    baseComponents[c.key] = { ...c, plannedAmount: amount, finalAmount: amount };

    if (c.type === 'earning') grossEarningsPlanned += amount;
    if (c.type === 'deduction') grossDeductionsPlanned += amount;
  }

  const plannedGross = grossEarningsPlanned - grossDeductionsPlanned;

  // Attendance adjustments
  const workDaysPerWeek = emp.employment?.workDaysPerWeek || 5;
  const workingDays = computeWorkingDays(year, month, workDaysPerWeek);
  const perDay = perDayRate(grossEarningsPlanned, workingDays);

  const from = dayjs(`${year}-${String(month).padStart(2, '0')}-01`).toDate();
  const to = dayjs(from).endOf('month').toDate();

  const [leaves, attendance, holidays] = await Promise.all([
    Leave.find({ employee: emp._id, date: { $gte: from, $lte: to }, approved: true }),
    Attendance.find({ employee: emp._id, date: { $gte: from, $lte: to } }),
    Holiday.find({ date: { $gte: from, $lte: to } }),
  ]);

  const holidaySet = new Set(holidays.map(h => dayjs(h.date).format('YYYY-MM-DD')));
  const attMap = new Map(attendance.map(a => [dayjs(a.date).format('YYYY-MM-DD'), a]));
  const leaveMap = new Map(leaves.map(l => [dayjs(l.date).format('YYYY-MM-DD'), l]));

  let unpaidDays = 0;
  let halfDays = 0;

  for (let d = 1; d <= dayjs(from).daysInMonth(); d++) {
    const key = dayjs(`${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`).format('YYYY-MM-DD');
    const a = attMap.get(key);
    const l = leaveMap.get(key);
    const dow = dayjs(key).day();

    // Skip weekends
    if (workDaysPerWeek === 5) {
      if (dow === 0 || dow === 6) continue;
    } else {
      if (dow === 0) continue;
    }

    // Skip holidays
    if (holidaySet.has(key)) continue;

    // Leaves
    if (l) {
      if (l.type === 'unpaid') unpaidDays += 1;
      else if (l.type === 'half-day') halfDays += 1;
      continue;
    }

    // Attendance
    if (a) {
      if (a.status === 'absent') unpaidDays += 1;
      else if (a.status === 'half-day') halfDays += 1;
    } else {
      unpaidDays += 1; // No attendance or leave
    }
  }

  const attendanceDeduction = unpaidDays * perDay + 0.5 * halfDays * perDay;

  // Adjust earnings
  const earningsKeys = Object.keys(baseComponents).filter(k => baseComponents[k].type === 'earning');
  const totalEarnings = sum(earningsKeys.map(k => baseComponents[k].finalAmount));
  const factor = totalEarnings > 0 ? (totalEarnings - attendanceDeduction) / totalEarnings : 1;

  for (const k of earningsKeys) {
    const comp = baseComponents[k];
    comp.finalAmount = applyRounding(Math.max(0, comp.finalAmount * factor), comp.rounding);
  }

  const grossEarnings = sum(earningsKeys.map(k => baseComponents[k].finalAmount));

  // Deductions (kept planned amount as-is)
  const deductionKeys = Object.keys(baseComponents).filter(k => baseComponents[k].type === 'deduction');
  for (const k of deductionKeys) {
    const comp = baseComponents[k];
    comp.finalAmount = applyRounding(comp.plannedAmount, comp.rounding);
  }

  const grossDeductions = sum(deductionKeys.map(k => baseComponents[k].finalAmount));
  const netPay = Math.max(0, grossEarnings - grossDeductions);

  return {
    plannedGross,
    workingDays,
    unpaidDays,
    halfDays,
    perDay,
    components: Object.fromEntries(
      Object.entries(baseComponents).map(([k, v]) => [
        k,
        { amount: v.finalAmount, planned: v.plannedAmount, type: v.type, taxable: v.taxable },
      ])
    ),
    grossEarnings,
    grossDeductions,
    netPay,
  };
}

export async function runPayroll({ year, month }) {
  try {
    const emps = await Employee.find({ 'employment.status': 'active' });
    const results = [];

    for (const emp of emps) {
      const calc = await calculateEmployeePayroll(emp, { year, month });
      results.push({ emp, calc });
    }

    return results; // ✅ Now returns after processing all employees
  } catch (error) {
    console.error('Error running payroll:', error);
    throw error;
  }
}
