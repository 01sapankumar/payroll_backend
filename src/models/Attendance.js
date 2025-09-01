import mongoose from 'mongoose';


const AttendanceSchema = new mongoose.Schema({
employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
date: { type: Date, required: true },
status: { type: String, enum: ['present','absent','half-day','weekoff','holiday'], required: true },
hoursWorked: { type: Number, default: 0 },
overtimeHours: { type: Number, default: 0 },
}, { timestamps: true, indexes: [{ fields: { employee: 1, date: 1 }, options: { unique: true } }] });


export default mongoose.model('Attendance', AttendanceSchema);