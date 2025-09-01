import mongoose from 'mongoose';


const PayrollRunSchema = new mongoose.Schema({
cycleKey: { type: String, required: true }, // e.g., 2025-08
year: { type: Number, required: true },
month: { type: Number, required: true },
status: { type: String, enum: ['draft','locked','paid'], default: 'draft' },
employees: [{
employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
grossEarnings: Number,
grossDeductions: Number,
netPay: Number,
breakdown: Object // component-wise values
}]
}, { timestamps: true, indexes: [{ fields: { cycleKey: 1 }, options: { unique: true } }] });


export default mongoose.model('PayrollRun', PayrollRunSchema);