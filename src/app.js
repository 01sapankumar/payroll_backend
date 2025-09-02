// app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();


import authRoutes from "./routes/auth.routes.js"
import employeeRoutes from "./routes/employee.routes.js"
import componentRoutes from './routes/employee.routes.js'
import leaveRoutes from './routes/leave.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import holidayRoutes from './routes/holiday.routes.js';
import payrollRoutes from './routes/payroll.routes.js';

import { notFound, errorHandler } from './middleware/error.js';

const app = express();


app.use(helmet());
app.use(cors({ origin: process.env.ORIGIN?.split(',') || '*', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15*60*1000, limit: 300 }));

app.get('/health', (req,res)=>res.json({ ok: true }));

app.use('/api/auth', authRoutes)
app.use('/api/employees', employeeRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/payroll', payrollRoutes);

app.use(notFound);
app.use(errorHandler);


export default app;
