import { Builder, By, until } from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox.js";

export const fetchScrollableContent = async (url: string): Promise<string> => {
  let driver = await new Builder()
    .forBrowser("firefox")
    .setFirefoxOptions(new firefox.Options())
    .build();

  try {
    await driver.get(url);
    await driver.wait(until.elementLocated(By.css("body")), 10000);

    let previousHeight = await driver.executeScript(
      "return document.body.scrollHeight"
    );
    while (true) {
      await driver.executeScript(
        "window.scrollTo(0, document.body.scrollHeight)"
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      let newHeight = await driver.executeScript(
        "return document.body.scrollHeight"
      );
      if (newHeight === previousHeight) break;
      previousHeight = newHeight;
    }

    return await driver.getPageSource();
  } finally {
    await driver.quit();
  }
};
