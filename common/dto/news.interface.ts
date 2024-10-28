import { INewsSourceSelector } from "../../sources/dto/news-source.interface";

export interface IExtractedNews {
  title: string;
  url: string;
  date: string;
  image?: string;
  description?: string;
  content?: string;
}

export interface IExtractNewsFromHTMLRequest {
  html: string;
  selectors: INewsSourceSelector;
}
