import {Value} from "./Value";
import {fakerGenerator} from "../FakerGenerator";
import {FormattedStringFactory, FormatHints} from "../FormattedStringFactory";


export class StringValue implements Value {
  readonly hints: FormatHints;
  readonly formattedStringFactory: FormattedStringFactory;
  readonly minLength: number;
  readonly maxLength?: number;

  constructor(formattedStringFactory: FormattedStringFactory, hints: FormatHints, minLength?: number, maxLength?: number) {
    this.formattedStringFactory = formattedStringFactory;
    this.hints = hints;

    if (maxLength !== undefined && minLength !== undefined && minLength > maxLength) {
      this.minLength = maxLength
    } else {
      this.minLength = minLength ?? 0;
    }
    this.maxLength = maxLength;
  }

  getGeneratorAst() {
    const formattedString = this.formattedStringFactory.getFormattedString(this.hints);
    if(formattedString) {
      return formattedString;
    }

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
