export type TokenPayload = {
  payload: any;
  secret: string;
  subject: string;
};

export interface ITokenProvider {
  sign: (data: TokenPayload) => string;
}
