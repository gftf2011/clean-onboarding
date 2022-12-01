export namespace HttpRequest {
  export type UrlParams<T> = T;
  export type Body<R> = R;
  export type Headers<S> = S;
}

export namespace HttpResponse {
  export type Body = any;
}

export interface HttpRequest<UrlType = any, BodyType = any, HeaderType = any> {
  urlParams?: HttpRequest.UrlParams<UrlType>;
  body?: HttpRequest.Body<BodyType>;
  headers?: HttpRequest.Headers<HeaderType>;
}

export interface HttpResponse {
  statusCode: number;
  body?: HttpResponse.Body;
}
