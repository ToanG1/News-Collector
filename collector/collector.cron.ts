import { CronJob } from "encore.dev/cron";
import { newsSerpColelctorAPI } from "./collector.controller";

const _ = new CronJob("News Collector", {
  title: "New Collector Cron",
  every: "60s",
  endpoint: newsSerpColelctorAPI,
});
