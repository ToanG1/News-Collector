import { Subscription } from "encore.dev/pubsub";
import { Topic } from "encore.dev/pubsub";
import { IExtractedNews } from "../common/dto/news.interface";
import { saveNews, getNews } from "./news.service";
import {
  calculateSimilarity,
  isDuplicateNews,
} from "../common/utils/similarity.util";

export interface SaveNewsEvent {
  newsSourceId: number;
  news: IExtractedNews[];
  date: string;
}

export const saveNewsEvent = new Topic<SaveNewsEvent>("save-news-event", {
  deliveryGuarantee: "at-least-once",
});

const saveNewsSubscriber = new Subscription(
  saveNewsEvent,
  "save-news-without-duplicate",
  {
    handler: async (event) => {
      const existedNews = await getNews(event.newsSourceId, event.date);
      const unSavedNews  = findUnSavedNews(event.news, existedNews);
      saveNews(event.newsSourceId, unSavedNews);
    },
  }
);

const findUnSavedNews = (
  news: IExtractedNews[],
  existedNews: IExtractedNews[]
): IExtractedNews[] => {
  const duplicatationFilteredNews = news.filter((n) => {
    const isDuplicate = existedNews.some((en) => isDuplicateNews(en, n));
    if (isDuplicate) {
      existedNews.push(n);
    }
    return !isDuplicate;
  });

  return duplicatationFilteredNews;
};
