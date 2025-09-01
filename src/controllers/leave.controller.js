import Leave from '../models/Leave.js';


export const requestLeave = async (req, res) => {
const leave = await Leave.create(req.body);
res.status(201).json(leave);
};


export const approveLeave = async (req, res) => {
const leave = await Leave.findByIdAndUpdate(req.params.id, { approved: true, approvedBy: req.admin.email }, { new: true });
if (!leave) return res.status(404).json({ message: 'Leave not found' });
res.json(leave);
};


export const listLeaves = async (req, res) => {
const list = await Leave.find().populate('employee','code firstName lastName');
res.json(list);
};