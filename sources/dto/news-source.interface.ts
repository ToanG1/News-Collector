export interface INewsSource {
  id?: number;
  name: string;
  link: string;
  description?: string;
  headers: { [key: string]: string };
  selector: INewsSourceSelector;
}

export interface INewsSourceSelector {
  items: string;
  title: string;
  image: string;
  postLink: string;
  content: string;
}
