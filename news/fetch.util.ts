import puppeteer, { Browser, Page } from "puppeteer";

const capabilities = {
  "tb:options": {
    key: "TestingBot Secret",
    secret: "809deda67b66b897d463ecb8fc6361af",
  },
  browserName: "chrome",
  browserVersion: "latest",
};

export const fetchScrollableContent = async (url: string): Promise<string> => {
  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      browserWSEndpoint: `wss://cloud.testingbot.com/puppeteer?capabilities=${encodeURIComponent(
        JSON.stringify(capabilities)
      )}`,
      headless: true,
    });

    const page: Page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    return await fetchContent(page, url);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

const fetchContent = async (page: Page, url: string): Promise<string> => {
  await page.goto(url, { waitUntil: "networkidle2" });

  const scrollToBottom = async (page: Page): Promise<void> => {
    let previousHeight: number | null = null;

    while (true) {
      previousHeight = await page.evaluate(() => document.body.scrollHeight);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise((r) => setTimeout(r, 1000));
      const newHeight: number = await page.evaluate(
        () => document.body.scrollHeight
      );

      if (newHeight === previousHeight) break;
    }
  };

  await scrollToBottom(page);

  return await page.evaluate(() => document.body.getHTML());
};
