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
  getCategoryById,
  getNewsSourceById,
} from "./sources.service";

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

export const getCategoryByIdAPI = api(
  {
    expose: true,
    method: "GET",
    path: "/collector/category/:id",
  },
  async (params: { id: number }): Promise<ICategory> => {
    const category = await getCategoryById(params.id);
    if (!category) {
      throw new APIError(ErrCode.NotFound, "Category not found");
    }

    return category;
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

export const getNewsSourceByIdAPI = api(
  {
    expose: true,
    method: "GET",
    path: "/collector/news-source/:id",
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
    path: "/collector/news-source",
  },
  async (request: INewsSource): Promise<IResponse> => {
    await updateNewsSource(request);
    return { message: "News source updated" };
  }
);
