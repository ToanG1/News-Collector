import { secret } from "encore.dev/config";

const api_key = secret("SCRAPER_API_KEY");
const api_url = "https://api.scraperapi.com";
const customizeHeaders = "country_code=vn&device_type=desktop&render=true";

export const fetchByScraperApi = async (url: string) => {
  const response = await fetch(
    `${api_url}?api_key=${api_key.toString()}&url=${encodeURIComponent(
      url
    )}&${customizeHeaders}`
  );
  if (response.status !== 200)
    throw new Error(
      `Scraper response failed with code: ${response.status} \n ${response.statusText}`
    );
  return response.text();
};
