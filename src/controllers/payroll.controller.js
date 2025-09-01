import PayrollRun from '../models/PayrollRun.js';
import Payslip from '../models/Payslip.js';
import Employee from '../models/Employee.js';
import { calculateEmployeePayroll, runPayroll } from '../services/payroll.service.js';


export const preview = async (req, res) => {
const { year, month, employeeId } = req.query;
if (!year || !month) return res.status(400).json({ message: 'year & month required' });
if (employeeId){
const emp = await Employee.findById(employeeId);
if (!emp) return res.status(404).json({ message: 'Employee not found' });
const calc = await calculateEmployeePayroll(emp, { year: Number(year), month: Number(month) });
return res.json({ employee: emp._id, calc });
}
const resu = await runPayroll({ year: Number(year), month: Number(month) });
res.json(resu.map(r=>({ employee: r.emp._id, calc: r.calc })));
};


export const createRun = async (req, res) => {
const { year, month } = req.body;
if (!year || !month) return res.status(400).json({ message: 'year & month required' });
const cycleKey = `${year}-${String(month).padStart(2,'0')}`;
const previews = await runPayroll({ year, month });
const payload = previews.map(({ emp, calc })=>({
employee: emp._id,
grossEarnings: calc.grossEarnings,
grossDeductions: calc.grossDeductions,
netPay: calc.netPay,
breakdown: calc.components
}));
const run = await PayrollRun.create({ cycleKey, year, month, employees: payload });
res.status(201).json(run);
};


export const lockRun = async (req, res) => {
const run = await PayrollRun.findByIdAndUpdate(req.params.id, { status: 'locked' }, { new: true });
};