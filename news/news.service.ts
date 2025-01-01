import { SQLDatabase } from "encore.dev/storage/sqldb";
import { IExtractedNews } from "../common/dto/news.interface";

const database = new SQLDatabase("news", { migrations: "./migrations" });

export const saveFetchLog = (url: string) => {
  database.exec`
      INSERT INTO FETCH_LOGS (URL)
      VALUES (${url})
  `;
};

export const saveNews = (newsSourceId: number, news: IExtractedNews[]) => {
  news.forEach(async (n) => {
    await database.exec`
          INSERT INTO NEWS (NEWS_SOURCE_ID, TITLE, URL, IMAGE, CONTENT)
          VALUES (${newsSourceId}, ${n.title}, ${n.url}, ${n.image}, ${n.content})
      `;
  });
};
