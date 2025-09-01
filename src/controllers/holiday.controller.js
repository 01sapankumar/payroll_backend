import Holiday from '../models/Holiday.js';


export const upsertHoliday = async (req, res) => {
const { date } = req.body;
const updated = await Holiday.findOneAndUpdate({ date }, req.body, { new: true, upsert: true, setDefaultsOnInsert: true });
res.json(updated);
};


export const listHolidays = async (req, res) => {
const list = await Holiday.find().sort('date');
res.json(list);
};