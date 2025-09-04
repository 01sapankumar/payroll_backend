import { Router } from "express";
import { upsertHoliday, listHolidays, updateHoliday, deleteHoliday } from "../controllers/holiday.controller.js";
import { requireAdmin } from "../middleware/auth.js";

const r = Router();
r.use(requireAdmin);

r.post("/", upsertHoliday);      // Create single/range holidays
r.get("/", listHolidays);        // List all holidays
r.put("/:id", updateHoliday);    // Edit holiday
r.delete("/:id", deleteHoliday); // Delete holiday

export default r;
