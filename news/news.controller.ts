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
  async (request: IExtractNewsFromHTMLRequest): Promise<IExtractedNews> => {
    const doc = new JSDOM(request.html).window.document;

    const title = doc.querySelector(request.selectors.title)?.textContent;
    const image = doc
      .querySelector(request.selectors.image)
      ?.getAttribute("src");
    const link = doc
      .querySelector(request.selectors.postLink)
      ?.getAttribute("href");

    return {
      title: title || "",
      url: link || "",
      image: image || "",
      date: new Date(),
    };
  }
);
