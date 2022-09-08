import {Value} from "./Value";
import {
  getMinMaxRangeAst,
  getRandomAlphanumericAst,
  getRandomNumberAst,
  getRandomWordAst
} from "./AstGenerators";


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
      const getRandomLength = getRandomNumberAst(getMinMaxRangeAst(this.minLength, this.maxLength));
      return getRandomAlphanumericAst(getRandomLength);
    }

    return getRandomWordAst();
  }
}
