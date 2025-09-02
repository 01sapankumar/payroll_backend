// app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import componentRoutes from './routes/employee.routes.js';
import leaveRoutes from './routes/leave.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import holidayRoutes from './routes/holiday.routes.js';
import payrollRoutes from './routes/payroll.routes.js';

import { notFound, errorHandler } from './middleware/error.js';

const app = express();

// Security middlewares
app.use(helmet());

// Hardcoded CORS for frontend localhost
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/payroll', payrollRoutes);

// 404 & error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
