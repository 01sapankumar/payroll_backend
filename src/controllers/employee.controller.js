import Employee from '../models/Employee.js';


export const createEmployee = async (req, res) => {
const emp = await Employee.create(req.body);
res.status(201).json(emp);
};


export const listEmployees = async (req, res) => {
const items = await Employee.find().sort('-createdAt');
res.json(items);
};


export const getEmployee = async (req, res) => {
const item = await Employee.findById(req.params.id);
if (!item) return res.status(404).json({ message: 'Employee not found' });
res.json(item);
};


export const updateEmployee = async (req, res) => {
const item = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
if (!item) return res.status(404).json({ message: 'Employee not found' });
res.json(item);
};
export const deleteEmployee = async (req, res) => {
await Employee.findByIdAndDelete(req.params.id);
res.json({ ok: true });
};