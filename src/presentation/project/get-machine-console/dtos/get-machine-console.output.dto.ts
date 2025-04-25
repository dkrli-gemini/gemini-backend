export class GetMachineConsoleOutputDto {
  consoleUrl: string;

  constructor(consoleUrl: string) {
    this.consoleUrl = consoleUrl;
  }
}
