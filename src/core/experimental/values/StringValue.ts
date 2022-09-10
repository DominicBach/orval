import {Value} from "./Value";
import {
  getObjectLiteralAst,
  getRandomAlphanumericAst,
  getRandomNumberAst,
  getRandomWordAst
} from "../AstGenerators";


export class StringValue implements Value {
  readonly minLength: number;
  readonly maxLength?: number;

  constructor(minLength?: number, maxLength?: number) {
    if (maxLength !== undefined && minLength !== undefined && minLength > maxLength) {
      this.minLength = maxLength
    } else {
      this.minLength = minLength ?? 0;
    }
    this.maxLength = maxLength;
  }

  getGeneratorAst() {
    if (this.minLength > 0 || this.maxLength !== undefined) {
      const getRandomLength = getRandomNumberAst(getObjectLiteralAst({
        min: this.minLength,
        max: this.maxLength
      }, true));
      return getRandomAlphanumericAst(getRandomLength);
    }

    return getRandomWordAst();
  }
}
