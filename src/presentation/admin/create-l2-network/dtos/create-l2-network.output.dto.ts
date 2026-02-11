export class CreateL2NetworkOutputDto {
  id: string;
  name: string;
  projectId: string;
  isL2: boolean;

  constructor(input: {
    id: string;
    name: string;
    projectId: string;
    isL2: boolean;
  }) {
    this.id = input.id;
    this.name = input.name;
    this.projectId = input.projectId;
    this.isL2 = input.isL2;
  }
}
