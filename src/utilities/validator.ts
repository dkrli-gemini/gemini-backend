class Validator<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  static expect<T>(value: T) {
    return new Validator(value);
  }

  toBeNotNull(): this {
    if (this.value == null || this.value == undefined) {
      throw new Error('Expected value to be not empty.');
    }
    return this;
  }
}
