import { Request, Response } from "express";
import { MiddlewareRecord } from "../types";
import db from "../db";

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    task_id INTEGER PRIMARY KEY AUTOINCREMENT,
    text VARCHAR(255),
    completed BOOLEAN NOT NULL
  )
`);

const mw: MiddlewareRecord = {
  "get /tasks": async (req: Request, res: Response) => {
    try {
      // fetch all habits
      const query = db.prepare("SELECT * FROM tasks");

      const tasks = query.all();

      res.json(tasks);
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  "post /tasks": async (req: Request, res: Response) => {
    try {
      const { text } = req.body;

      // Basic validation
      if (!text) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const insertStmt = db.prepare(`
        INSERT INTO tasks (text, completed)
        VALUES (?, 0)
      `);

      const result = insertStmt.run(text); // SQLite uses 1/0 for booleans

      // Fetch the newly inserted habit
      const newTask = db
        .prepare("SELECT * FROM tasks WHERE task_id = ?")
        .get(result.lastInsertRowid);

      res.status(201).json(newTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  "put /tasks/:id": async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.id, 10);
    const { completed } = req.body;

    if (isNaN(taskId)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    try {
      const updateStmt = db.prepare(
        `UPDATE tasks SET completed = ? WHERE task_id = ?`
      );
      const info = updateStmt.run(completed, taskId);

      if (info.changes === 0) {
        return res.status(404).json({ error: "Task not found" });
      }

      // Fetch the updated habit
      const task = db
        .prepare("SELECT * FROM tasks WHERE task_id = ?")
        .run(taskId);

      res.status(200).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  "delete /tasks/:id": async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
      return res.status(400).json({ error: "Invalid habit ID" });
    }

    try {
      const deleteStmt = db.prepare("DELETE FROM tasks WHERE task_id = ?");

      const info = deleteStmt.run(taskId);

      if (info.changes === 0) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default mw;
