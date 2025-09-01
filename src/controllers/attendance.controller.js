import Attendance from '../models/Attendance.js';


export const upsertAttendance = async (req, res) => {
const { employee, date } = req.body;
const updated = await Attendance.findOneAndUpdate({ employee, date }, req.body, { new: true, upsert: true, setDefaultsOnInsert: true });
res.json(updated);
};


export const listAttendance = async (req, res) => {
const { employee, from, to } = req.query;
const q = {};
if (employee) q.employee = employee;
if (from || to) q.date = { ...(from?{ $gte: new Date(from) }:{}), ...(to?{ $lte: new Date(to) }:{}) };
const list = await Attendance.find(q).populate('employee','code firstName lastName');
res.json(list);
};