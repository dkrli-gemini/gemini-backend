export class AddAclRuleOutputDto {
  ruleId: string;
  listId: string;

  constructor(ruleId: string, listId: string) {
    this.ruleId = ruleId;
    this.listId = listId;
  }
}
