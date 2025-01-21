const api_key = "afc2e1950d778afa90b42bbad5a08cc1";

const scraperAPI = "https://api.scraperapi.com";
const customizeHeaders = "country_code=vn&device_type=desktop&render=true";

export const fetchByScraperApi = async (url: string) => {
  const response = await fetch(
    `${scraperAPI}?api_key=${api_key}&url=${encodeURIComponent(
      url
    )}&${customizeHeaders}`
  );
  if (response.status !== 200)
    throw new Error(
      `Scraper response failed with code: ${response.status} \n ${response.statusText}`
    );
  return response.text();
};
