import { CronJob } from "encore.dev/cron";
import { newsColelctor } from "./collector.controller";

const _ = new CronJob("News Collector", {
  title: "Send welcome emails",
  every: "60s",
  endpoint: newsColelctor,
});
