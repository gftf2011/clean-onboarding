/* eslint-disable sort-imports */
import fs from 'fs';
import handlebars from 'handlebars';

import { ITemplateProvider } from '../../application/contracts/providers';

export class HandlebarsTemplateProvider implements ITemplateProvider {
  public async parse(input: ITemplateProvider.Input): Promise<string> {
    const templateFileContent = await fs.promises.readFile(input.filePath, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(input.data);
  }
}
