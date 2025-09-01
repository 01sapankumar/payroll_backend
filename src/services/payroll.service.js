import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween.js';
import Employee from '../models/Employee.js';
import Leave from '../models/Leave.js';
import Attendance from '../models/Attendance.js';
import Holiday from '../models/Holiday.js';
import MonthlyCTC from '../models/MonthlyCTC.js';
import { applyRounding } from './rounding.js';


dayjs.extend(isBetween);


export function daysInMonth(year, month){
return dayjs(`${year}-${String(month).padStart(2,'0')}-01`).daysInMonth();
}


export function perDayRate(monthlyGross, workingDays){
return monthlyGross / Math.max(workingDays, 1);
}


function computeWorkingDays(year, month, workDaysPerWeek){
const totalDays = daysInMonth(year, month);
let workingDays = 0;
for (let d=1; d<=totalDays; d++){
const date = dayjs(`${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`);
const dow = date.day(); // 0 Sun ... 6 Sat
if (workDaysPerWeek === 5) {
if (dow >= 1 && dow <= 5) workingDays++;
} else {
if (dow !== 0) workingDays++; // 6-day week: Monday-Saturday
}
}
return workingDays;
}


function sum(values){ return values.reduce((a,b)=>a+b,0); }


export async function ensureMonthlyCTCSnapshot(emp, year, month){
const key = await MonthlyCTC.findOne({ employee: emp._id, year, month });
if (key) return key;
const monthlyCTC = emp.ctc/12;
return MonthlyCTC.create({ employee: emp._id, year, month, monthlyCTC, snapshot: emp.payStructure });
}


export async function calculateEmployeePayroll(emp, { year, month }){
const monthlyCTC = emp.ctc/12;
await ensureMonthlyCTCSnapshot(emp, year, month);


// Step 1: Build base components before attendance impact
const baseComponents = {};
let grossEarningsPlanned = 0;
}