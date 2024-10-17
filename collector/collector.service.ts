import { SQLDatabase } from "encore.dev/storage/sqldb";
import { ITask } from "./dto/task.interface";
import { randomUUID } from "crypto";
import { ITaskLog } from "./dto/task-log.interface";

const database = new SQLDatabase("collector", { migrations: "./migrations" });

export const createTask = async (task: ITask): Promise<string> => {
  const taskId = randomUUID();
  await database.exec`
        INSERT INTO TASKS (CODE, NAME, DESCRIPTION, CATEGORY_ID, NEWS_SOURCE_ID)
        VALUES (${taskId}, ${task.name}, ${task.description}, ${task.categoryId}, ${task.newsSourceId})
    `;
  return taskId;
};

export const saveTaskLog = async (taskLog: ITaskLog): Promise<void> => {
  await database.exec`
        INSERT INTO TASK_LOGS (TASK_ID, STATUS)
        VALUES (${taskLog.taskId}, ${taskLog.status})
    `;
};
