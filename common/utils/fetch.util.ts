const api_url = "https://api.scraperapi.com";
const customizeHeaders = "country_code=vn&device_type=desktop&render=true";

export const fetchByScraperApi = async (url: string, apiKey: string) => {
  const reqUrl = `${api_url}?api_key=${apiKey}&url=${encodeURIComponent(
    url
  )}&${customizeHeaders}`;

  const response = await fetch(reqUrl);
  if (response.status !== 200)
    throw new Error(
      `URL: ${reqUrl} \nScraper response failed with code: ${response.status} \n ${response.statusText}`
    );
  return response.text();
};
