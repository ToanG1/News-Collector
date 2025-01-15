import { SQLDatabase } from "encore.dev/storage/sqldb";
import { ICategory } from "./dto/category.interface";
import { INewsSource, INewsSourceSelector } from "./dto/news-source.interface";
import { IPublisher } from "./dto/publisher.interface";

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

export const deleteCategory = async (id: number): Promise<void> => {
  await database.exec`
      DELETE FROM CATEGORY WHERE ID=${id}
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
      INSERT INTO NEWS_SOURCES (PUBLISHER_ID, CATEGORY_ID, NAME, LINK, DESCRIPTION, HEADERS)
      VALUES 
      (${newsSource.publisherId}, ${newsSource.categoryId}, ${newsSource.name}, 
      ${newsSource.link}, ${newsSource.description || null}, ${JSON.stringify(
    newsSource.headers
  )})
    `;

  const newSourceRow = await database.queryRow`
        SELECT ID FROM NEWS_SOURCES 
        WHERE PUBLISHER_ID = ${newsSource.publisherId} AND CATEGORY_ID = ${newsSource.categoryId} AND NAME = ${newsSource.name} AND LINK = ${newsSource.link}
    `;

  if (!newSourceRow) {
    throw new Error("News source was not created");
  }
  console.log(newSourceRow!.id);

  await database.exec`
      INSERT INTO NEW_SOURCES_SELECTORS (NEWS_SOURCES_ID, ITEMS, TITLE, IMAGE, POST_LINK, CONTENT)
      VALUES 
      (${newSourceRow!.id}, ${newsSource.selector.items}, ${
    newsSource.selector.title
  }, 
      ${newsSource.selector.image}, ${newsSource.selector.postLink}, ${
    newsSource.selector.content
  })
    `;
};

export const getNewsSources = async (): Promise<INewsSource[]> => {
  const result: INewsSource[] = [];
  const rows = await database.query`
      SELECT ns.ID AS NS_ID, ns.*, nss.* FROM NEWS_SOURCES ns
      JOIN NEW_SOURCES_SELECTORS nss ON nss.NEWS_SOURCES_ID = ns.ID
  `;
  for await (const row of rows) {
    result.push({
      id: row.ns_id,
      publisherId: row.publisher_id,
      categoryId: row.category_id,
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
      JOIN NEW_SOURCES_SELECTORS nss ON nss.NEWS_SOURCES_ID = ns.ID
      WHERE ns.ID=${id}
  `;

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    publisherId: row.publisher_id,
    categoryId: row.category_id,
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

export const deleteNewsSource = async (id: number): Promise<void> => {
  await database.exec`
      DELETE FROM NEWS_SOURCES WHERE ID=${id}
    `;
};

export const createPublisher = async (publisher: IPublisher): Promise<void> => {
  await database.exec`
      INSERT INTO PUBLISHERS (NAME, LOGO, DESCRIPTION, LINK, LANGUAGE, REGION)
      VALUES (${publisher.name}, ${publisher.logo}, ${publisher.description}, ${publisher.link}, ${publisher.language}, ${publisher.region})
    `;
};

export const getPublishers = async (): Promise<IPublisher[]> => {
  const result: IPublisher[] = [];
  const rows = await database.query<IPublisher>`
      SELECT * FROM PUBLISHERS
  `;
  for await (const row of rows) {
    result.push(row);
  }
  return result;
};
