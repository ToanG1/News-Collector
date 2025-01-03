import puppeteer, { Page, Browser } from "puppeteer";

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const fetchScrollableContent = async (url: string): Promise<string> => {
  const browser: Browser = await puppeteer.launch();
  const page: Page = await browser.newPage();

  await page.goto(url);

  let previousHeight: number;
  while (true) {
    previousHeight = await page.evaluate(() => document.body.scrollHeight);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await delay(1000);
    const newHeight = await page.evaluate(() => document.body.scrollHeight);
    if (newHeight === previousHeight) break;
  }

  const content: string = await page.content();
  await browser.close();
  return content;
};
