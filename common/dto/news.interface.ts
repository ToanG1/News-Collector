export interface IExtractedNews {
  title: string;
  url: string;
  date: Date;
  image?: string;
  description?: string;
  content?: string;
}

export interface INewsSourceSelector {
  title: string;
  image: string;
  postLink: string;
  content: string;
}

export interface IExtractNewsFromHTMLRequest {
  html: string;
  selectors: INewsSourceSelector;
}
