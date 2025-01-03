import { SQLDatabase } from "encore.dev/storage/sqldb";
import {
  ITask,
  ITaskConfig,
  ITaskLog,
  IUpdateTaskConfig,
} from "./dto/task.interface";
import { randomUUID } from "crypto";

const database = new SQLDatabase("task", { migrations: "./migrations" });

export const createTask = async (task: ITask): Promise<string> => {
  const taskId = randomUUID();

  await database.exec`
        INSERT INTO TASKS (CODE, NAME, DESCRIPTION, CATEGORY_ID, NEWS_SOURCE_ID)
        VALUES (${taskId}, ${task.name}, ${task.description}, ${task.categoryId}, ${task.newsSourceId})
    `;

  await database.exec`
        INSERT INTO TASK_CONFIGS (TASK_ID)
        VALUES (${taskId})
    `;

  return taskId;
};

export const updateTask = async (task: ITask): Promise<void> => {
  await database.exec`
      UPDATE TASKS
      SET NAME = ${task.name}, 
          DESCRIPTION = ${task.description}, 
          CATEGORY_ID = ${task.categoryId}, 
          NEWS_SOURCE_ID = ${task.newsSourceId}
      WHERE CODE = ${task.code!}
    `;
};

export const updateTaskConfig = async (
  task: IUpdateTaskConfig
): Promise<void> => {
  await database.exec`
      UPDATE TASK_CONFIGS
      SET IS_ENABLED = ${task.isEnabled}, 
          RUN_AT = ${task.runAt}
      WHERE TASK_ID = ${task.taskId}
      `;
};

export const getTasks = async (): Promise<ITaskConfig[]> => {
  const result: ITaskConfig[] = [];
  const rows = await database.query`
      SELECT T.*, TC.IS_ENABLED, TC.RUN_AT
      FROM TASKS T
      JOIN TASK_CONFIGS TC ON T.CODE = TC.TASK_ID
  `;
  for await (const row of rows) {
    result.push({
      taskId: row.code,
      name: row.name,
      categoryId: row.category_id,
      sourceId: row.news_source_id,
      isEnabled: row.is_enabled,
      runAt: row.run_at,
    });
  }
  return result;
};

export const getTasksNeedToRun = async (): Promise<ITask[]> => {
  const result: ITask[] = [];
  const rows = await database.query`
      SELECT T.*
      FROM TASKS T
      JOIN TASK_CONFIGS TC ON T.CODE = TC.TASK_ID
      WHERE TC.IS_ENABLED = true
      AND TC.RUN_AT = EXTRACT(HOUR FROM CURRENT_TIMESTAMP);
  `;
  for await (const row of rows) {
    result.push({
      code: row.code,
      name: row.name,
      description: row.description,
      categoryId: row.category_id,
      newsSourceId: row.news_source_id,
    });
  }
  return result;
};

export const saveTaskLog = async (taskLog: ITaskLog): Promise<void> => {
  await database.exec`
      INSERT INTO TASK_LOGS (TASK_ID, STATUS, DESCRIPTION)
      VALUES 
      (${taskLog.taskId}, ${taskLog.status}, ${taskLog.description || null})
    `;
};

export const getTaskLogsByTaskId = async (
  taskId: string,
  date: string
): Promise<ITaskLog[]> => {
  const result: ITaskLog[] = [];
  const rows = await database.query`
      SELECT * FROM TASK_LOGS WHERE TASK_ID = ${taskId} AND DATE(CREATED_AT) = ${date} ORDER BY CREATED_AT DESC
  `;
  for await (const row of rows) {
    result.push({
      taskId: row.task_id,
      status: row.status,
      description: row.description,
      date: new Date(row.created_at),
    });
  }
  return result;
};
