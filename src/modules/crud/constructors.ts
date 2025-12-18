import Crud from "../../utils/crud";
import { CrudConstructor } from "../../utils/crud/types";
import schema from "./schemas";

export const CrudConstructors: CrudConstructor[] = [
  {
    tableName: "f0_habits",
    endpoint: "/habit",
    schema: schema.habit,
  },
  {
    tableName: "f0_tasks",
    endpoint: "/task",
    schema: schema.task,
  },
  {
    tableName: "f0_objectives",
    endpoint: "/objective",
    schema: schema.objective,
  },
  {
    tableName: "f0_schedules",
    endpoint: "/habit-schedule",
    schema: schema.schedule,
  },
  {
    tableName: "f0_habit_times",
    endpoint: "/habit-time",
    schema: schema.habitTime,
  },
  {
    tableName: "f0_habit_streaks",
    endpoint: "/habit-streak",
    schema: schema.habitStreak,
  },
  {
    tableName: "f0_habit_logs",
    endpoint: "/habit-log",
    schema: schema.habitLogs,
  },
  {
    tableName: "f0_tags",
    endpoint: "/tag",
    schema: schema.tag,
  },
  {
    tableName: "f0_user_widgets",
    endpoint: "/widget",
    schema: schema.userWidgets,
  },
];
