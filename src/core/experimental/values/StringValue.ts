import {Value} from "./Value";
import {fakerGenerator} from "../FakerGenerator";


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
      return fakerGenerator.random.alphaNumeric(
          fakerGenerator.datatype.number({
            min: this.minLength,
            max: this.maxLength
          }));
    }
    return fakerGenerator.random.word();
  }
}
