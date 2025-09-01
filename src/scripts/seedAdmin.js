import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from '../utils/db.js';
import Admin from '../models/Admin.js';


(async ()=>{
await connectDB();
const exists = await Admin.findOne({ email: 'admin@payroll.local' });
if (!exists){
await Admin.create({ name: 'Super Admin', email: 'admin@payroll.local', password: 'Admin@123' });
console.log('✅ Admin seeded: admin@payroll.local / Admin@123');
} else {
console.log('ℹ️ Admin already exists');
}
process.exit(0);
})();