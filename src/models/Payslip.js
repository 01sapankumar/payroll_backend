import mongoose from 'mongoose';


const PayslipSchema = new mongoose.Schema({
employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
year: { type: Number, required: true },
month: { type: Number, required: true },
payDate: { type: Date },
grossEarnings: Number,
grossDeductions: Number,
netPay: Number,
breakdown: Object,
notes: String
}, { timestamps: true, indexes: [{ fields: { employee: 1, year: 1, month: 1 }, options: { unique: true } }] });


export default mongoose.model('Payslip', PayslipSchema);