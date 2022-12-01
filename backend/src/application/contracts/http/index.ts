export namespace HttpRequest {
  export type UrlParams = any;
  export type Body = any;
  export type Headers = any;
}

export namespace HttpResponse {
  export type Body = any;
}

export interface HttpRequest {
  urlParams?: HttpRequest.UrlParams;
  body?: HttpRequest.Body;
  headers?: HttpRequest.Headers;
}

export interface HttpResponse {
  statusCode: number;
  body?: HttpResponse.Body;
}
