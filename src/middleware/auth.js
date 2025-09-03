import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Employee from '../models/Employee.js';

// 🔹 Admin Auth (using your hardcoded token)
export async function requireAdmin(req, res, next) {
  try {
    const hardcodedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjZhMjQ3ZGRjZDc1YjJhN2Y2MzU2YSIsImVtYWlsIjoiYWRtaW5AcGF5cm9sbC5sb2NhbCIsImlhdCI6MTc1NjgwNDk5NSwiZXhwIjoxNzU3NDA5Nzk1fQ.lRfyS2M5Sb3n0jLHlmI8II1VjJeQz9SBa3J_b0dX6ME';
    const token = hardcodedToken;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ message: 'Unauthorized' });

    req.user = { id: admin._id.toString(), email: admin.email, isAdmin: true };
    next();
  } catch (e) {
    console.error('Admin check failed:', e.message);
    res.status(401).json({ message: 'Invalid admin token' });
  }
}

// 🔹 Employee Auth (hardcoded for now)
export async function requireAuth(req, res, next) {
  try {
    // TEMP hardcoded token for testing employee auth
    const hardcodedEmployeeToken = 'PUT_YOUR_EMPLOYEE_TOKEN_HERE';
    const token = hardcodedEmployeeToken;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findById(decoded.id);
    if (!employee) return res.status(401).json({ message: 'Unauthorized' });

    req.user = { id: employee._id.toString(), email: employee.email, isAdmin: false };
    next();
  } catch (err) {
    console.error('Employee check failed:', err.message);
    res.status(401).json({ message: 'Invalid employee token' });
  }
}
