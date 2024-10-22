import { api } from "encore.dev/api";
import { Status } from "../common/enums/status.interface";
import { ITask } from "./dto/task.interface";
import {
  createCategory,
  createNewsSource,
  createTask,
  getCategories,
  getNewsSources,
  saveTaskLog,
  updateCategory,
  updateNewsSource,
} from "./collector.service";
import { IResponse } from "../common/dto/response.interface";
import { ICategory } from "./dto/category.interface";
import { INewsSource } from "./dto/news-source.interface";

export const newsColelctorAPI = api({}, async (): Promise<IResponse> => {
  const task: ITask = {
    name: "Send welcome emails",
    description: "Send welcome emails to users",
    categoryId: 1,
    newsSourceId: 1,
  };

  const taskId = await createTask(task);
  saveTaskLog({ taskId: taskId, status: Status.DONE });

  return { message: `Task ${taskId} was stopped with status ${Status.DONE}` };
});

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
