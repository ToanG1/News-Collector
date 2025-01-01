import { api, APIError, ErrCode } from "encore.dev/api";
import { JSDOM } from "jsdom";
import {
  IFetchRequest,
  IFetchResponse,
  IHTTPMethod,
} from "./dto/fetch.interface";
import { saveFetchLog, saveNews, getNews } from "./news.service";
import {
  IExtractedNews,
  IExtractNewsFromHTMLRequest,
} from "../common/dto/news.interface";
import { sources } from "~encore/clients";
import { ITask } from "../task/dto/task.interface";
import { INewsSource } from "../sources/dto/news-source.interface";

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

  const fetchResponse: IFetchResponse = await fetchNewsApi({
    url: newsSource.link,
    method: IHTTPMethod.GET,
    headers: newsSource.headers,
  });

  if (!fetchResponse.body) {
    throw new Error("News were not found ! URL:" + newsSource.link);
  }

  const { news } = await extractNewsFromHTMLApi({
    html: fetchResponse.body,
    selectors: newsSource.selector,
  });

  saveNews(task.newsSourceId, news);
});

const fetchNewsApi = async (
  request: IFetchRequest
): Promise<IFetchResponse> => {
  saveFetchLog(request.url);

  const response = await fetch(request.url, {
    method: request.method,
    headers: request.headers,
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  let body: any;
  try {
    body = await response.text();
  } catch (e) {
    body = null;
  }

  let json: any;
  try {
    json = await response.json();
  } catch (e) {
    json = null;
  }

  return {
    status: response.status,
    body: body,
    json: json,
  };
};

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

    const imageElement = doc.querySelector(request.selectors.image);
    const image =
      imageElement?.getAttribute("data-src-image") ||
      imageElement?.getAttribute("src");

    const link = doc
      .querySelector(request.selectors.postLink)
      ?.getAttribute("href");
    const content = doc
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
