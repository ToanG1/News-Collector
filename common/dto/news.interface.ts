import { INewsSourceSelector } from "../../sources/dto/news-source.interface";

export interface IExtractedNews {
  title: string;
  url: string;
  image: string;
  content: string;
}

export interface IExtractNewsFromHTMLRequest {
  html: string;
  selectors: INewsSourceSelector;
}
