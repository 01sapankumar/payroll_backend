import { Router } from 'express';
import { upsertAttendance, listAttendance } from '../controllers/attendance.controller.js';
import { requireAdmin } from '../middleware/auth.js';
const r = Router();
r.use(requireAdmin);
r.post('/', upsertAttendance);
r.get('/', listAttendance);
export default r;