/* eslint-disable sort-imports */
import fs from 'fs';
import handlebars from 'handlebars';

import { TemplateProvider } from '../../application/contracts/providers';

export class HandlebarsTemplateProvider implements TemplateProvider {
  public async parse(input: TemplateProvider.Input): Promise<string> {
    const templateFileContent = await fs.promises.readFile(input.filePath, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(input.data);
  }
}
