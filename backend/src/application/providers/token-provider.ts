export type TokenPayload = {
  payload: any;
  secret: string;
};

export interface ITokenProvider {
  sign: (data: TokenPayload) => string;
}
