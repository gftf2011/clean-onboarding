export namespace ITemplateService {
  export type Input = {
    filePath: string;
    data: any;
  };
}

export interface ITemplateService {
  parse: (input: ITemplateService.Input) => Promise<string>;
}
