type TokenPayload = {
  data: any;
};

export interface ITokenProvider {
  sign: (data: TokenPayload) => Promise<string>;
}
