import { SQLDatabase } from "encore.dev/storage/sqldb";
import { ITask } from "./dto/task.interface";
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
  return taskId;
};

export const saveTaskLog = async (taskLog: ITaskLog): Promise<void> => {
  await database.exec`
        INSERT INTO TASK_LOGS (TASK_ID, STATUS)
        VALUES (${taskLog.taskId}, ${taskLog.status})
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
