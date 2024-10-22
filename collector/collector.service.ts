import { SQLDatabase } from "encore.dev/storage/sqldb";
import { ITask, ITaskConfig } from "./dto/task.interface";
import { randomUUID } from "crypto";
import { ITaskLog } from "./dto/task-log.interface";
import { ICategory } from "./dto/category.interface";
import { INewsSource } from "./dto/news-source.interface";

const database = new SQLDatabase("collector", { migrations: "./migrations" });

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

export const getTasks = async (): Promise<ITaskConfig[]> => {
  const result: ITaskConfig[] = [];
  const rows = await database.query`
      SELECT T.CODE, T.NAME, C.NAME as "category", NS.LINK, TC.IS_ENABLED, TC.RUN_AT
      FROM TASKS T
      JOIN TASK_CONFIGS TC ON T.CODE = TC.TASK_ID
      JOIN CATEGORY C ON T.CATEGORY_ID = C.ID
      JOIN NEWS_SOURCES NS ON T.NEWS_SOURCE_ID = NS.ID
  `;
  for await (const row of rows) {
    result.push({
      taskId: row.code,
      name: row.name,
      category: row.category,
      source: row.link,
      isEnabled: row.is_enabled,
      runAt: row.run_at,
    });
  }
  return result;
};

export const getTasksNeedToRun = async (): Promise<ITask[]> => {
  const result: ITask[] = [];
  const rows = await database.query<ITask>`
      SELECT T.*
      FROM TASKS T
      JOIN TASK_CONFIGS TC ON T.CODE = TC.TASK_ID
      WHERE TC.IS_ENABLED = true
      AND TC.RUN_AT = EXTRACT(HOUR FROM CURRENT_TIMESTAMP);
  `;
  for await (const row of rows) {
    result.push(row);
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

export const createCategory = async (category: ICategory): Promise<void> => {
  await database.exec`
      INSERT INTO CATEGORY (NAME, DESCRIPTION)
      VALUES (${category.name}, ${category.description || ""})
    `;
};

export const updateCategory = async (category: ICategory): Promise<void> => {
  await database.exec`
      UPDATE CATEGORY
      SET NAME = ${category.name}, DESCRIPTION = ${category.description!}
      WHERE ID = ${category.id!}
    `;
};

export const getCategories = async (): Promise<ICategory[]> => {
  const result: ICategory[] = [];
  const rows = await database.query<ICategory>`SELECT * FROM CATEGORY`;
  for await (const row of rows) {
    result.push(row);
  }
  return result;
};

export const createNewsSource = async (
  newsSource: INewsSource
): Promise<void> => {
  await database.exec`
      INSERT INTO NEWS_SOURCES (NAME, LINK, DESCRIPTION)
      VALUES 
      (${newsSource.name}, ${newsSource.link}, ${newsSource.description || ""})
    `;
};

export const getNewsSources = async () => {
  const result: INewsSource[] = [];
  const rows = await database.query<INewsSource>`SELECT * FROM NEWS_SOURCES`;
  for await (const row of rows) {
    result.push(row);
  }
  return result;
};

export const updateNewsSource = async (
  newsSource: INewsSource
): Promise<void> => {
  await database.exec`
      UPDATE NEWS_SOURCES
      SET NAME = ${newsSource.name}, 
          LINK = ${newsSource.link}, 
          DESCRIPTION = ${newsSource.description!}
      WHERE ID = ${newsSource.id!}
    `;
};
