import { Router } from 'express';
import { upsertHoliday, listHolidays } from '../controllers/holiday.controller.js';
import { requireAdmin } from '../middleware/auth.js';
const r = Router();
r.use(requireAdmin);
r.post('/', upsertHoliday);
r.get('/', listHolidays);
export default r;