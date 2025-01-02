import { api } from "encore.dev/api";
import { JSDOM } from "jsdom";
import { saveFetchLog, saveNews, getNews } from "./news.service";
import {
  IExtractedNews,
  IExtractNewsFromHTMLRequest,
} from "../common/dto/news.interface";
import { sources } from "~encore/clients";
import { ITask } from "../task/dto/task.interface";
import { INewsSource } from "../sources/dto/news-source.interface";
import { fetchScrollableContent } from "./fetch.util";

export const getExtractedNewsApi = api(
  {
    expose: true,
    method: "GET",
    path: "/news/:date",
  },
  async (params: { date: string }): Promise<{ news: IExtractedNews[] }> => {
    return { news: await getNews(params.date) };
  }
);

export const getNewsApi = api({}, async (task: ITask): Promise<void> => {
  const newsSource: INewsSource = await sources.getNewsSourceByIdAPI({
    id: task.newsSourceId,
  });

  await saveFetchLog(newsSource.link);

  const fetchResponse: string = await fetchScrollableContent(newsSource.link);

  if (!fetchResponse) {
    throw new Error("News were not found ! URL:" + newsSource.link);
  }

  const { news } = await extractNewsFromHTMLApi({
    html: fetchResponse,
    selectors: newsSource.selector,
  });

  saveNews(task.newsSourceId, news);
});

const extractNewsFromHTMLApi = async (
  request: IExtractNewsFromHTMLRequest
): Promise<{ news: IExtractedNews[] }> => {
  const news: IExtractedNews[] = [];
  const doc = new JSDOM(request.html).window.document;

  const items = doc.querySelectorAll(request.selectors.items);
  for (const item of items) {
    const title = item
      .querySelector(request.selectors.title)
      ?.textContent?.replace("\n", "");

    const imageElement = item.querySelector(request.selectors.image);
    const image =
      imageElement?.getAttribute("data-src-image") ||
      imageElement?.getAttribute("src");

    const link = item
      .querySelector(request.selectors.postLink)
      ?.getAttribute("href");
    const content = item
      .querySelector(request.selectors.content)
      ?.textContent?.replace("\n", "");

    news.push({
      title: title || "",
      url: link || "",
      image: image || "",
      content: content || "",
    });
  }

  return { news };
};
