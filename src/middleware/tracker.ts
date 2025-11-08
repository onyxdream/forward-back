import { Request, Response } from "express";
import { MiddlewareRecord } from "../types";
import db, { Cursor } from "../db";

db.exec(`
  CREATE TABLE IF NOT EXISTS habit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    goal INTEGER NOT NULL DEFAULT 1,
    overflow BOOLEAN NOT NULL
  )
`);

db.exec(`CREATE TABLE IF NOT EXISTS habit_record (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  habit_id INTEGER NOT NULL,
  date DATE NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (habit_id) REFERENCES habit(id)
  )
`);

function getLogs(id: number | null, startDate?: string, endDate?: string) {
  // GET /tracker/habit/1/logs?startDate=2024-01-01&endDate=2024-01-31

  if (id && isNaN(id)) {
    throw new Error("[fc:getLogs] Id is not a number.");
  }

  // Validate date strings if provided
  const isValidDate = (dateStr: any) => {
    return typeof dateStr === "string" && !isNaN(Date.parse(dateStr));
  };

  let query = `SELECT * FROM habit_record`;

  const params: any[] = [];
  let whereAdded = false;

  const addCondition = (condition: string, param: string | number) => {
    query += `${whereAdded ? " AND " : " WHERE "} ${condition}`;
    params.push(param);
    whereAdded = true;
  };

  if (id) addCondition("id = ?", id);

  if (startDate && isValidDate(startDate))
    addCondition(" AND date >= ?", startDate);

  if (endDate && isValidDate(endDate)) addCondition("AND date <= ?", endDate);

  query += " ORDER BY date";

  try {
    const logs = db.prepare(query).all(...params);

    return logs;
  } catch (error) {
    throw new Error(`Failed to retrieve logs: ${error}`);
  }
}

const mw: MiddlewareRecord = {
  "get /tracker/habit:id": (req: Request, res: Response) => {
    try {
      const habitId: string | undefined = req.params.id;

      // fetch specific habit
      const habit = db.prepare("SELECT * FROM habit WHERE id = ?").get(habitId);

      if (habit) {
        res.json(habit);
      } else {
        res.status(404).json({ error: "Habit not found" });
      }
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  "get /tracker/habit": (req: Request, res: Response) => {
    try {
      // fetch all habits
      const query = db.prepare("SELECT * FROM habit");

      const habits = query.all();

      res.json(habits);
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  "post /tracker/habit": (req: Request, res: Response) => {
    try {
      const { name, goal, overflow } = req.body;

      // Basic validation
      if (!name || goal == null || overflow == null) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const insertStmt = db.prepare(`
        INSERT INTO habit (name, goal, overflow)
        VALUES (?, ?, ?)
      `);

      const result = insertStmt.run(name, goal, overflow ? 1 : 0); // SQLite uses 1/0 for booleans

      // Fetch the newly inserted habit
      const newHabit = db
        .prepare("SELECT * FROM habit WHERE id = ?")
        .get(result.lastInsertRowid);

      res.status(201).json(newHabit);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  "delete /tracker/habit/:id": (req: Request, res: Response) => {
    const habitId = parseInt(req.params.id, 10);

    if (isNaN(habitId)) {
      return res.status(400).json({ error: "Invalid habit ID" });
    }

    try {
      const deleteLogs = db.prepare(
        "DELETE FROM habit_record WHERE habit_id = ?"
      );

      const deleteStmt = db.prepare("DELETE FROM habit WHERE id = ?");

      deleteLogs.run(habitId);
      const info = deleteStmt.run(habitId);

      if (info.changes === 0) {
        return res.status(404).json({ error: "Habit not found" });
      }

      res.status(200).json({ message: "Habit deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  "put /tracker/habit/:id": (req: Request, res: Response) => {
    const habitId = parseInt(req.params.id, 10);
    const { name, goal, overflow } = req.body;

    if (isNaN(habitId)) {
      return res.status(400).json({ error: "Invalid habit ID" });
    }

    // Optional: validate input fields
    if (
      typeof name !== "string" ||
      typeof goal !== "number" ||
      typeof overflow !== "boolean"
    ) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    try {
      const updateStmt = db.prepare(
        `UPDATE habit_record SET name = ?, goal = ?, overflow = ? WHERE id = ?`
      );
      const info = updateStmt.run(name, goal, overflow ? 1 : 0, habitId);

      if (info.changes === 0) {
        return res.status(404).json({ error: "Habit not found" });
      }

      // Fetch the updated habit
      const habit = db
        .prepare("SELECT * FROM habit_record WHERE id = ?")
        .get(habitId);

      res.status(200).json(habit);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  "post /tracker/habit/:id/log": (req: Request, res: Response) => {
    const habitId = parseInt(req.params.id, 10);
    const { delta, date } = req.body;

    if (isNaN(habitId)) {
      return res.status(400).json({ error: "Invalid habit ID" });
    }

    if (typeof delta !== "number") {
      return res.status(400).json({ error: "Delta must be a number" });
    }

    const today = date || new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    try {
      // Check if a log for today already exists for this habit
      const existingLog = db
        .prepare("SELECT * FROM habit_record WHERE habit_id = ? AND date = ?")
        .get(habitId, today);

      if (existingLog) {
        // Update the existing log's progress

        const newProgress = (Number(existingLog.progress) || 0) + delta;
        const updateStmt = db.prepare(
          "UPDATE habit_record SET progress = ? WHERE id = ?"
        );
        updateStmt.run(newProgress, existingLog.id);

        // Return the updated log
        const updatedLog = db
          .prepare("SELECT * FROM habit_record WHERE id = ?")
          .get(existingLog.id);
        return res.json(updatedLog);
      } else {
        // Create a new log
        const insertStmt = db.prepare(`
        INSERT INTO habit_record (habit_id, date, progress)
        VALUES (?, ?, ?)
      `);
        const result = insertStmt.run(habitId, today, delta);

        const newLog = db
          .prepare("SELECT * FROM habit_record WHERE id = ?")
          .get(result.lastInsertRowid);
        return res.status(201).json(newLog);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  "delete /tracker/log/:id": (req: Request, res: Response) => {
    const logId = parseInt(req.params.id, 10);

    if (isNaN(logId)) {
      return res.status(400).json({ error: "Invalid log ID" });
    }

    try {
      const deleteStmt = db.prepare("DELETE FROM habit_record WHERE id = ?");
      const info = deleteStmt.run(logId);

      if (info.changes === 0) {
        return res.status(404).json({ error: "Log not found" });
      }
      res.json({ message: "Log deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  "put /tracker/log/:id": (req: Request, res: Response) => {
    const logId = parseInt(req.params.id, 10);
    const { progress } = req.body;

    if (isNaN(logId)) {
      return res.status(400).json({ error: "Invalid log ID" });
    }

    if (typeof progress !== "number") {
      return res.status(400).json({ error: "Progress must be a number" });
    }

    try {
      const updateStmt = db.prepare(
        "UPDATE habit_record SET progress = ? WHERE id = ?"
      );
      const info = updateStmt.run(progress, logId);

      if (info.changes === 0) {
        return res.status(404).json({ error: "Log not found" });
      }

      const updatedLog = db
        .prepare("SELECT * FROM habit_record WHERE id = ?")
        .get(logId);
      res.json(updatedLog);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  "get /tracker/habit/:id/logs": (req: Request, res: Response) => {
    // GET /tracker/habit/1/logs?startDate=2024-01-01&endDate=2024-01-31

    const habitId = parseInt(req.params.id, 10);
    const { startDate, endDate } = req.query; // optional query params

    if (isNaN(habitId)) {
      return res.status(400).json({ error: "Invalid habit ID" });
    }

    // Validate date strings if provided
    const isValidDate = (dateStr: any) => {
      return typeof dateStr === "string" && !isNaN(Date.parse(dateStr));
    };

    let query = `SELECT * FROM habit_record WHERE habit_id = ?`;

    const params: any[] = [habitId];

    if (startDate && isValidDate(startDate)) {
      query += " AND date >= ?";
      params.push(startDate);
    }

    if (endDate && isValidDate(endDate)) {
      query += " AND date <= ?";
      params.push(endDate);
    }

    query += " ORDER BY date";

    console.log(query);

    try {
      const logs = db.prepare(query).all(...params);

      res.json(logs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  "get /tracker/habit/logs": (req: Request, res: Response) => {
    const { startDate, endDate } = req.query; // optional query params

    // Validate date strings if provided
    const isValidDate = (dateStr: any) => {
      return typeof dateStr === "string" && !isNaN(Date.parse(dateStr));
    };

    let query = `SELECT * FROM habit_record`;

    const params: any[] = [];
    let whereAdded = false;

    if (startDate && isValidDate(startDate)) {
      query += ` ${!whereAdded ? "WHERE" : "AND"} date >= ?`;

      if (!whereAdded) whereAdded = true;

      params.push(startDate);
    }

    if (endDate && isValidDate(endDate)) {
      query += ` ${!whereAdded ? "WHERE" : "AND"} date <= ?`;

      if (!whereAdded) whereAdded = true;

      params.push(endDate);
    }

    query += " ORDER BY date";

    try {
      const logs = db.prepare(query).all(...params);

      res.json(logs);

      return logs;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  "get /tracker": (req: Request, res: Response) => {
    const { startDate, endDate } = req.query; // optional query params

    try {
      // fetch all habits
      const query = db.prepare("SELECT * FROM habit");

      const habits = query.all();

      const logs = getLogs(null, String(startDate), String(endDate));

      const habitLogs = habits.map((habit) => {
        const thisHabitLogs = logs.filter((log) => log.habit_id == habit.id);

        return { ...habit, logs: thisHabitLogs };
      });

      res.json(habitLogs);
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  "get /tracker/attribute": (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;

    try {
      // build date filter for SQL and params array
      let dateWhere = "";
      const params: any[] = [];

      if (startDate && endDate) {
        dateWhere = "WHERE date BETWEEN ? AND ?";
        params.push(String(startDate), String(endDate));
      } else if (startDate) {
        dateWhere = "WHERE date >= ?";
        params.push(String(startDate));
      } else if (endDate) {
        dateWhere = "WHERE date <= ?";
        params.push(String(endDate));
      }

      /*const sql = `
      WITH habit_totals AS (
        SELECT habit_id, SUM(progress) AS total_progress
        FROM habit_record
        ${dateWhere}
        GROUP BY habit_id
      )
      SELECT
        a.attribute_id AS attribute_id, a.name AS attribute,
        ROUND(COALESCE(SUM(ht.total_progress * har.weight), 0.0)) AS weighted_progress_sum
      FROM attributes a
      LEFT JOIN habit_attribute_rel har ON har.attribute_id = a.attribute_id
      LEFT JOIN habit_totals ht ON ht.habit_id = har.habit_id
      GROUP BY a.attribute_id, a.name
      ORDER BY a.name;
    `;*/

      const sql = `
    WITH habit_totals AS (
    SELECT 
        hr.habit_id, 
        SUM(hr.progress) AS total_progress,
        h.goal
    FROM 
        habit_record hr
    JOIN 
        habit h ON hr.habit_id = h.id
    ${dateWhere}
    GROUP BY 
        hr.habit_id, h.goal
)
SELECT
    a.attribute_id AS attribute_id, 
    a.name AS attribute,
    ROUND(COALESCE(SUM(ht.total_progress * har.weight), 0.0)) AS weighted_progress_sum,
    ROUND(COALESCE(SUM(ht.total_progress / ht.goal * har.weight), 0.0), 2) AS progress_ratio
FROM 
    attributes a
LEFT JOIN 
    habit_attribute_rel har ON har.attribute_id = a.attribute_id
LEFT JOIN 
    habit_totals ht ON ht.habit_id = har.habit_id
GROUP BY 
    a.attribute_id, a.name
ORDER BY 
    a.name;
    `;

      const stmt = db.prepare(sql);
      const rows = stmt.all(...params);

      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  "get /tracker/groups": (req: Request, res: Response) => {
    try {
      const groups = db.prepare("SELECT * FROM habit_group").all();

      res.json(groups);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default mw;
