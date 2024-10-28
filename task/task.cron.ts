import { CronJob } from "encore.dev/cron";
import { newsCollectorAPI } from "./task.controller";

const _ = new CronJob("News Collector", {
  title: "News Collector Cron",
  every: "60s",
  endpoint: newsCollectorAPI,
});
