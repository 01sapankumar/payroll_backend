import mongoose from 'mongoose';


const SalaryComponentSchema = new mongoose.Schema({
key: { type: String, unique: true, required: true },
label: { type: String, required: true },
type: { type: String, enum: ['earning','deduction','reimbursement'], required: true },
defaultTaxable: { type: Boolean, default: true },
description: String
}, { timestamps: true });


export default mongoose.model('SalaryComponent', SalaryComponentSchema);