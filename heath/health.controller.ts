import { api } from "encore.dev/api";
import { IResponse } from "../common/dto/response.interface";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const database = new SQLDatabase("health", { migrations: "./migrations" });

export const checkHealthAPI = api(
  { expose: true, method: "GET", path: "/health" },
  async (): Promise<IResponse> => {
    const time = await database.queryRow`SELECT NOW()`.then((row) => row!.now);
    return {
      message: `${time}: News collector still alive!`,
    };
  }
);
