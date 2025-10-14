export class CreateForwardRuleOutputDto {
  created: boolean;

  constructor(ok: boolean) {
    this.created = ok;
  }
}
