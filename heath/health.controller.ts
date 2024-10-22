import { api } from "encore.dev/api";
import { IResponse } from "../common/dto/response.interface";

export const checkHealthAPI = api(
  { expose: true, method: "GET", path: "/health" },
  async (): Promise<IResponse> => {
    return { message: "News collector still alive!" };
  }
);
