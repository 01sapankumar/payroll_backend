import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';


export const login = async (req, res) => {
const { email, password } = req.body;
const admin = await Admin.findOne({ email });
if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
const ok = await admin.comparePassword(password);
if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.COOKIE_SECURE === 'true', maxAge: 7*24*3600*1000 });
res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
};


export const me = async (req, res) => {
res.json({ admin: req.admin });
};


export const logout = async (req, res) => {
res.clearCookie('token');
res.json({ ok: true });
};