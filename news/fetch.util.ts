import puppeteer, { Browser, Page } from "puppeteer-core";

export const fetchScrollableContent = async (url: string): Promise<string> => {
  let browser: Browser | null = null;

  try {
    const capabilities = {
      "tb:options": {
        key: "b06a23c6f4c89d909fad9a8b6da26255",
        secret: "4c20c155d0672dedf6ac23bad99448ce",
      },
      browserName: "chrome",
      browserVersion: "latest",
    };

    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://cloud.testingbot.com/puppeteer?capabilities=${encodeURIComponent(
        JSON.stringify(capabilities)
      )}`,
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

      await new Promise((r) => setTimeout(r, 3000));

      const newHeight: number = await page.evaluate(
        () => document.body.scrollHeight
      );

      if (newHeight === previousHeight) break;
    }
  };

  await scrollToBottom(page);

  return await page.evaluate(() => document.body.getHTML());
};
