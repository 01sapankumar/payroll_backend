import { Router } from 'express';
import { requestLeave, approveLeave, listLeaves } from '../controllers/leave.controller.js';
import { requireAdmin } from '../middleware/auth.js';
const r = Router();
r.use(requireAdmin);
r.post('/', requestLeave);
r.patch('/:id/approve', approveLeave);
r.get('/', listLeaves);
export default r;