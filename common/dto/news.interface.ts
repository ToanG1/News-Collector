export interface IExtractedNews {
  title: string;
  url: string;
  date: string;
  image?: string;
  description?: string;
  content?: string;
}

export interface INewsSourceSelector {
  items: string;
  title: string;
  image: string;
  postLink: string;
  content: string;
}

export interface IExtractNewsFromHTMLRequest {
  html: string;
  selectors: INewsSourceSelector;
}
