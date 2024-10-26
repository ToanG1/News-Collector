import { SQLDatabase } from "encore.dev/storage/sqldb";

const database = new SQLDatabase("news", { migrations: "./migrations" });

export const saveFetchLog = async (url: string) => {
  database.exec`
            INSERT INTO FETCH_LOGS (URL)
            VALUES (${url})
        `;
};
