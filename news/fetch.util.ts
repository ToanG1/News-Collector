import { secret } from "encore.dev/config";

const api_key = secret("SCRAPER_API_KEY");
const api_url = "https://api.scraperapi.com";
const customizeHeaders = "country_code=vn&device_type=desktop&render=true";

export const fetchByScraperApi = async (url: string) => {
  const reqUrl = `${api_url}?api_key=${api_key}&url=${encodeURIComponent(
    url
  )}&${customizeHeaders}`;

  const response = await fetch(reqUrl);
  if (response.status !== 200)
    throw new Error(
      `Scraper response failed with code: ${response.status} \n ${response.statusText}`
    );
  return response.text();
};

export const API_KEY = api_key;
