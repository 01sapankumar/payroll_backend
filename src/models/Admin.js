import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const AdminSchema = new mongoose.Schema({
email: { type: String, unique: true, required: true, lowercase: true, trim: true },
name: { type: String, required: true },
password: { type: String, required: true },
}, { timestamps: true });


AdminSchema.pre('save', async function(next){
if (!this.isModified('password')) return next();
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
next();
});


AdminSchema.methods.comparePassword = async function (pwd) {
return bcrypt.compare(pwd, this.password);
};
export default mongoose.model('Admin', AdminSchema);