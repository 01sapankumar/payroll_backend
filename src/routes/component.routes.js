import { Router } from 'express';
import { upsertComponent, listComponents } from '../controllers/component.controller.js';
import { requireAdmin } from '../middleware/auth.js';
const r = Router();
r.use(requireAdmin);
r.post('/', upsertComponent);
r.get('/', listComponents);
export default r;