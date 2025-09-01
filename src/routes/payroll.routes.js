import { Router } from 'express';
import { preview, createRun, lockRun, generatePayslips, listRuns } from '../controllers/payroll.controller.js';
import { requireAdmin } from '../middleware/auth.js';
const r = Router();
r.use(requireAdmin);
r.get('/preview', preview); // /api/payroll/preview?year=2025&month=8&employeeId=...
r.post('/runs', createRun); // creates draft
nr.patch('/runs/:id/lock', lockRun);
r.post('/runs/:id/payslips', generatePayslips);
r.get('/runs', listRuns);
export default r;