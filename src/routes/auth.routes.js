import { Router } from 'express';
import { login, me, logout } from '../controllers/auth.controller.js';
import { requireAdmin } from '../middleware/auth.js';
const r = Router();
r.post('/login', login);
r.get('/me', requireAdmin, me);
r.post('/logout', requireAdmin, logout);
export default r;