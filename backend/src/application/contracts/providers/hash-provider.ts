export interface IHashProvider {
  encode: (value: string, salt?: string) => Promise<string>;
}
