import mongoose from 'mongoose';


const HolidaySchema = new mongoose.Schema({
date: { type: Date, required: true, unique: true },
name: { type: String, required: true },
region: { type: String }
}, { timestamps: true });


export default mongoose.model('Holiday', HolidaySchema);