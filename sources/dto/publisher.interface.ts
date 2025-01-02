export interface IPublisher {
  id?: number;
  name: string;
  logo: string;
  description: string;
  link: string;
  language: Language;
  region: REGION;
}

enum Language {
  VI = "vi",
  EN = "en",
  JA = "ja",
  TH = "th",
}

enum REGION {
  VI = "VN",
  US = "US",
  JP = "JP",
  TH = "TH",
}
