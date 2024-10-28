import { SQLDatabase } from "encore.dev/storage/sqldb";
import { ICategory } from "./dto/category.interface";
import { INewsSource, INewsSourceSelector } from "./dto/news-source.interface";

const database = new SQLDatabase("sources", { migrations: "./migrations" });

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

export const getCategoryById = async (
  id: number
): Promise<ICategory | null> => {
  return await database.queryRow<ICategory>`SELECT * FROM CATEGORY WHERE ID = ${id}`;
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

export const getNewsSources = async (): Promise<INewsSource[]> => {
  const result: INewsSource[] = [];
  const rows = await database.query`
      SELECT ns.*, nss.* FROM NEWS_SOURCES ns
      JOIN PUBLISHERS p ON ns.PUBLISHER_ID = p.ID
      JOIN NEW_SOURCES_SELECTORS nss ON nss.PUBLISHER_ID = p.ID
  `;
  for await (const row of rows) {
    result.push({
      id: row.id,
      name: row.name,
      link: row.link,
      description: row.description,
      headers: JSON.parse(row.headers),
      selector: {
        items: row.items,
        title: row.title,
        image: row.image,
        postLink: row.post_link,
        content: row.content,
      },
    });
  }
  return result;
};

export const getNewsSourceById = async (
  id: number
): Promise<INewsSource | null> => {
  const row = await database.queryRow`
      SELECT ns.*, nss.* FROM NEWS_SOURCES ns
      JOIN PUBLISHERS p ON ns.PUBLISHER_ID = p.ID
      JOIN NEW_SOURCES_SELECTORS nss ON nss.PUBLISHER_ID = p.ID
      WHERE ns.ID=${id}
  `;

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    link: row.link,
    description: row.description,
    headers: JSON.parse(row.headers),
    selector: {
      items: row.items,
      title: row.title,
      image: row.image,
      postLink: row.post_link,
      content: row.content,
    },
  };
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
