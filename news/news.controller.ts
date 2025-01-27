import { api } from "encore.dev/api";
import { JSDOM } from "jsdom";
import { getNews } from "./news.service";
import {
  IExtractedNews,
  IExtractNewsFromHTMLRequest,
} from "../common/dto/news.interface";
import { sources } from "~encore/clients";
import { ITask } from "../task/dto/task.interface";
import { INewsSource } from "../sources/dto/news-source.interface";
import { fetchByScraperApi } from "../common/utils/fetch.util";
import { saveNewsEvent } from "./news.pubsub";
import { secret } from "encore.dev/config";

const api_key = secret("SCRAPER_API_KEY");

export const getExtractedNewsApi = api(
  {
    expose: true,
    method: "GET",
    path: "/news/:sourceId/:date",
  },
  async (params: {
    sourceId: number;
    date: string;
  }): Promise<{ news: IExtractedNews[] }> => {
    return { news: await getNews(params.sourceId, params.date) };
  }
);

export const getNewsApi = api({}, async (task: ITask): Promise<void> => {
  const newsSource: INewsSource = await sources.getNewsSourceByIdAPI({
    id: task.newsSourceId,
  });

  const html = await fetchByScraperApi(newsSource.link, api_key());

  const { news } = await extractNewsFromHTMLApi({
    html: html,
    selectors: newsSource.selector,
  });

  saveNewsEvent.publish({
    newsSourceId: task.newsSourceId,
    news: news,
    date: new Date().toISOString().split("T")[0],
  });
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
