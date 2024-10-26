export interface IFetchRequest {
  url: string;
  method: IHTTPMethod;
  headers?: { [key: string]: string };
}

export enum IHTTPMethod {
  GET = "GET",
  POST = "POST",
}

export interface IFetchResponse {
  status: number;
  body: string;
  json: any;
}
