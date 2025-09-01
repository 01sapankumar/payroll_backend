import mongoose from 'mongoose';


const AddressSchema = new mongoose.Schema({
line1: String, line2: String, city: String, state: String, zip: String, country: String
}, { _id: false });


const BankSchema = new mongoose.Schema({
accountName: String,
accountNumber: String,
ifsc: String,
bankName: String,
}, { _id: false });


const EmploymentSchema = new mongoose.Schema({
doj: { type: Date, required: true },
dol: { type: Date }, // date of leaving (optional)
status: { type: String, enum: ['active','inactive'], default: 'active' },
workDaysPerWeek: { type: Number, default: 5 }, // 5 or 6
}, { _id: false });


const EmployeeSchema = new mongoose.Schema({
code: { type: String, unique: true, required: true },
firstName: String,
lastName: String,
email: { type: String, unique: true, required: true },
phone: String,
address: AddressSchema,
bank: BankSchema,
employment: EmploymentSchema,
ctc: { type: Number, required: true }, // annual CTC in currency units
payStructure: {
// Default component allocation as percentages or fixed for monthly salary
components: [{
key: { type: String, required: true }, // e.g., BASIC, HRA, SPECIAL, PF_EMPLOYEE, etc.
type: { type: String, enum: ['earning','deduction','reimbursement'], required: true },
calc: {
method: { type: String, enum: ['pct_of_base','fixed','pct_of_ctc'], required: true },
value: { type: Number, required: true } // percentage (0-100) or fixed amount
},
taxable: { type: Boolean, default: true },
monthlyCap: { type: Number },
rounding: { type: String, enum: ['none','nearest','floor','ceil'], default: 'nearest' }
}]
}
}, { timestamps: true });


export default mongoose.model('Employee', EmployeeSchema);