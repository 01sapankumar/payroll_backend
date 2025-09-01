import mongoose from 'mongoose';


const MonthlyCTCSchema = new mongoose.Schema({
employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
year: { type: Number, required: true },
month: { type: Number, required: true }, // 1-12
monthlyCTC: { type: Number, required: true }, // CTC/12, stored for audit
snapshot: { type: Object, required: true } // snapshot of payStructure for the month
}, { timestamps: true, indexes: [{ fields: { employee: 1, year: 1, month: 1 }, options: { unique: true } }] });


export default mongoose.model('MonthlyCTC', MonthlyCTCSchema);