import SalaryComponent from '../models/SalaryComponent.js';


export const upsertComponent = async (req, res) => {
const { key } = req.body;
const updated = await SalaryComponent.findOneAndUpdate({ key }, req.body, { new: true, upsert: true, setDefaultsOnInsert: true });
res.json(updated);
};


export const listComponents = async (req, res) => {
const list = await SalaryComponent.find().sort('key');
res.json(list);
};