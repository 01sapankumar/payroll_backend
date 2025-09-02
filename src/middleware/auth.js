import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export async function requireAdmin(req, res, next) {
  try {
    // Hardcoded token (replace with your actual token from login)
    const hardcodedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjZhMjQ3ZGRjZDc1YjJhN2Y2MzU2YSIsImVtYWlsIjoiYWRtaW5AcGF5cm9sbC5sb2NhbCIsImlhdCI6MTc1NjgwNDk5NSwiZXhwIjoxNzU3NDA5Nzk1fQ.lRfyS2M5Sb3n0jLHlmI8II1VjJeQz9SBa3J_b0dX6ME';

    // You can temporarily ignore cookies and headers
    const token = hardcodedToken;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: fetch admin from DB
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ message: 'Unauthorized' });

    req.admin = { id: admin._id, email: admin.email, name: admin.name };
    next();
  } catch (e) {
    console.error('Token verification failed:', e.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
}
