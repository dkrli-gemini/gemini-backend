import { TemplateOfferModel } from '@prisma/client';

export class TemplateDto {
  id: string;
  name: string;
  url?: string;

  constructor(template: TemplateOfferModel) {
    this.id = template.id;
    this.name = template.name;
    this.url = template.url ?? undefined;
  }
}

export class ListTemplatesOutputDto {
  templates: TemplateDto[];

  constructor(templates: TemplateOfferModel[]) {
    this.templates = templates.map((template) => new TemplateDto(template));
  }
}
