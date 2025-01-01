import { api, APIError, ErrCode } from "encore.dev/api";
import { IResponse } from "../common/dto/response.interface";
import { ICategory } from "./dto/category.interface";
import { INewsSource } from "./dto/news-source.interface";
import {
  createCategory,
  getCategories,
  updateCategory,
  createNewsSource,
  getNewsSources,
  updateNewsSource,
  getNewsSourceById,
  createPublisher,
  getPublishers,
} from "./sources.service";
import { IPublisher } from "./dto/publisher.interface";

export const addCategoryAPI = api(
  {
    expose: true,
    method: "POST",
    path: "/sources/category",
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
    path: "/sources/category",
  },
  async (): Promise<{ categories: ICategory[] }> => {
    return { categories: await getCategories() };
  }
);

export const updateCategoryAPI = api(
  {
    expose: true,
    method: "PUT",
    path: "/sources/category",
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
    path: "/sources/news-source",
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
    path: "/sources/news-source",
  },
  async (): Promise<{ newsSources: INewsSource[] }> => {
    return { newsSources: await getNewsSources() };
  }
);

export const getNewsSourceByIdAPI = api(
  {
    expose: true,
    method: "GET",
    path: "/sources/news-source/:id",
  },
  async (params: { id: number }): Promise<INewsSource> => {
    const newsSource = await getNewsSourceById(params.id);
    if (!newsSource) {
      throw new APIError(ErrCode.NotFound, "News source not found");
    }

    return newsSource;
  }
);

export const updateNewsSourceAPI = api(
  {
    expose: true,
    method: "PUT",
    path: "/sources/news-source",
  },
  async (request: INewsSource): Promise<IResponse> => {
    await updateNewsSource(request);
    return { message: "News source updated" };
  }
);

export const addPublisherAPI = api(
  {
    expose: true,
    method: "POST",
    path: "/sources/publisher",
  },
  async (request: IPublisher): Promise<IResponse> => {
    await createPublisher(request);
    return { message: "Publisher added" };
  }
);

export const getPublishersAPI = api(
  {
    expose: true,
    method: "GET",
    path: "/sources/publisher",
  },
  async (): Promise<{ publishers: IPublisher[] }> => {
    return { publishers: await getPublishers() };
  }
);
