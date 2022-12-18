/* eslint-disable max-classes-per-file */
/* eslint-disable sort-imports */
import fs from 'fs';
import handlebars from 'handlebars';

import { TemplateProvider } from '../../application/contracts/providers';

type TemplateProviderProduct = TemplateProvider;

class HandlebarsTemplateProviderProduct implements TemplateProviderProduct {
  public async parse(input: TemplateProvider.Input): Promise<string> {
    const templateFileContent = await fs.promises.readFile(input.filePath, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(input.data);
  }
}

abstract class TemplateProviderCreator implements TemplateProvider {
  protected abstract factoryMethod(): TemplateProviderProduct;

  public async parse(input: TemplateProvider.Input): Promise<string> {
    const templateProvider = this.factoryMethod();
    const response = await templateProvider.parse(input);
    return response;
  }
}

export class HandlebarsTemplateProviderCreator extends TemplateProviderCreator {
  protected factoryMethod(): TemplateProviderProduct {
    return new HandlebarsTemplateProviderProduct();
  }
}
