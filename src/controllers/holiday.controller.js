import Holiday from '../models/Holiday.js';

// Helper to create all dates in range
const getDateRange = (startDate, endDate) => {
  const dates = [];
  let current = new Date(startDate);
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

// CREATE or UPSERT holidays (supports range)
export const upsertHoliday = async (req, res) => {
  try {
    const { startDate, endDate, name, region } = req.body;

    if (!startDate || !name) {
      return res.status(400).json({ message: "startDate and name are required" });
    }

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;

    const dates = getDateRange(start, end);

    const results = await Promise.all(
      dates.map(date =>
        Holiday.findOneAndUpdate(
          { date },
          { date, name, region },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        )
      )
    );

    res.json({ message: "Holidays set successfully", holidays: results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all holidays
export const listHolidays = async (req, res) => {
  try {
    const list = await Holiday.find().sort("date");
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a holiday by ID
export const updateHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Holiday.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Holiday not found" });
    }

    res.json({ message: "Holiday updated", holiday: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a holiday by ID
export const deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Holiday.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Holiday not found" });
    }

    res.json({ message: "Holiday deleted", holiday: deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
