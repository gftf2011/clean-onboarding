export namespace ITemplateProvider {
  export type Input = {
    filePath: string;
    data: any;
  };
}

export interface ITemplateProvider {
  parse: (input: ITemplateProvider.Input) => Promise<string>;
}
