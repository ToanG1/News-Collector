import { api, APIError, ErrCode } from "encore.dev/api";
import { JSDOM } from "jsdom";
import { IFetchRequest, IFetchResponse } from "../common/dto/fetch.interface";
import { saveFetchLog } from "./news.service";
import {
  IExtractedNews,
  IExtractNewsFromHTMLRequest,
} from "../common/dto/news.interface";

export const fetchNewsApi = api(
  {},
  async (request: IFetchRequest): Promise<IFetchResponse> => {
    saveFetchLog(request.url);

    const response = await fetch(request.url, {
      method: request.method,
      headers: request.headers,
    });

    if (!response.ok) {
      throw new APIError(ErrCode.PermissionDenied, response.statusText);
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
  }
);

export const extractNewsFrmSerpApi = api(
  {},
  async (
    request: IExtractNewsFromHTMLRequest
  ): Promise<{ news: IExtractedNews[] }> => {
    const date = new Date().toString();
    const news: IExtractedNews[] = [];
    const doc = new JSDOM(request.html).window.document;

    const items = doc.querySelectorAll(request.selectors.items);
    for (const item of items) {
      const title = item.querySelector(request.selectors.title)?.textContent;

      const imageElement = doc.querySelector(request.selectors.image);
      const image =
        imageElement?.getAttribute("data-src-image") ||
        imageElement?.getAttribute("src");

      const link = doc
        .querySelector(request.selectors.postLink)
        ?.getAttribute("href");

      news.push({
        title: title || "",
        url: link || "",
        image: image || "",
        date,
      });
    }

    return { news };
  }
);
