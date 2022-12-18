export namespace TemplateProvider {
  export type Input = {
    filePath: string;
    data: any;
  };
}

export interface TemplateProvider {
  parse: (input: TemplateProvider.Input) => Promise<string>;
}
