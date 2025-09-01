import jwt from 'jsonwebtoken';


export function requireAdmin(req, res, next) {
try {
const token = req.cookies.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
if (!token) return res.status(401).json({ message: 'Unauthorized' });
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.admin = { id: decoded.id, email: decoded.email };
next();
} catch (e) {
return res.status(401).json({ message: 'Invalid token' });
}
}