import mongoose from 'mongoose';


const LeaveSchema = new mongoose.Schema({
employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
date: { type: Date, required: true },
type: { type: String, enum: ['paid','unpaid','half-day'], required: true },
reason: String,
approved: { type: Boolean, default: false },
approvedBy: { type: String },
}, { timestamps: true, indexes: [{ fields: { employee: 1, date: 1 }, options: { unique: true } }] });


export default mongoose.model('Leave', LeaveSchema);