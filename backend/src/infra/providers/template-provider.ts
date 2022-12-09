/* eslint-disable sort-imports */
import fs from 'fs';
import handlebars from 'handlebars';

import { ITemplateService } from '../../application/contracts/providers';

export class HandlebarsTemplateService implements ITemplateService {
  public async parse(input: ITemplateService.Input): Promise<string> {
    const templateFileContent = await fs.promises.readFile(input.filePath, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(input.data);
  }
}
