import { api } from "encore.dev/api";
import { Status } from "../common/enums/status.interface";
import { ITask, ITaskConfig } from "./dto/task.interface";
import {
  createCategory,
  createNewsSource,
  createTask,
  getCategories,
  getNewsSources,
  getTasks,
  getTasksNeedToRun,
  saveTaskLog,
  updateCategory,
  updateNewsSource,
} from "./collector.service";
import { IResponse } from "../common/dto/response.interface";
import { ICategory } from "./dto/category.interface";
import { INewsSource } from "./dto/news-source.interface";

export const newsSerpColelctorAPI = api({}, async (): Promise<IResponse> => {
  const tasks = await getTasksNeedToRun();

  for await (const task of tasks) {
    await saveTaskLog({ taskId: task.code!, status: Status.IN_PROGRESS });
    try {
      console.log(`Task ${task.code} is running...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await saveTaskLog({ taskId: task.code!, status: Status.DONE });
    } catch (error: any) {
      await saveTaskLog({
        taskId: task.code!,
        status: Status.FAILED,
        description: error,
      });
    }
  }
  return { message: `Done with ${tasks.length} tasks` };
});

export const createTaskAPI = api(
  {
    expose: true,
    method: "POST",
    path: "/collector/task",
  },
  async (request: ITask): Promise<IResponse> => {
    const taskId = await createTask(request);
    return { message: `Task ${taskId} was created` };
  }
);

export const getTasksAPI = api(
  {
    expose: true,
    method: "GET",
    path: "/collector/task",
  },
  async (): Promise<{ tasks: ITaskConfig[] }> => {
    return { tasks: await getTasks() };
  }
);

export const addCategoryAPI = api(
  {
    expose: true,
    method: "POST",
    path: "/collector/category",
  },
  async (request: ICategory): Promise<IResponse> => {
    await createCategory(request);
    return { message: "Category added" };
  }
);

export const getCategoriesAPI = api(
  {
    expose: true,
    method: "GET",
    path: "/collector/category",
  },
  async (): Promise<{ categories: ICategory[] }> => {
    return { categories: await getCategories() };
  }
);

export const updateCategoryAPI = api(
  {
    expose: true,
    method: "PUT",
    path: "/collector/category",
  },
  async (request: ICategory): Promise<IResponse> => {
    await updateCategory(request);
    return { message: "Category updated" };
  }
);

export const addNewsSourceAPI = api(
  {
    expose: true,
    method: "POST",
    path: "/collector/news-source",
  },
  async (request: INewsSource): Promise<IResponse> => {
    await createNewsSource(request);
    return { message: "News source added" };
  }
);

export const getNewsSourcesAPI = api(
  {
    expose: true,
    method: "GET",
    path: "/collector/news-source",
  },
  async (): Promise<{ newsSources: INewsSource[] }> => {
    return { newsSources: await getNewsSources() };
  }
);

export const updateNewsSourceAPI = api(
  {
    expose: true,
    method: "PUT",
    path: "/collector/news-source",
  },
  async (request: INewsSource): Promise<IResponse> => {
    await updateNewsSource(request);
    return { message: "News source updated" };
  }
);
