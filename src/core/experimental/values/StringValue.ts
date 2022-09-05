import {PrimitiveValue} from "./PrimitiveValue";
import {Faker} from "@faker-js/faker";
import {MockGeneratorFunction} from "../MockGeneratorFunction";

export class StringValue implements PrimitiveValue<string> {
  readonly type = 'string';
  readonly minLength: number;
  readonly maxLength?: number;

  constructor(minLength?: number, maxLength?: number) {
    if(maxLength !== undefined && minLength !== undefined && minLength > maxLength) {
      this.minLength = maxLength
    } else {
      this.minLength = minLength ?? 0;
    }
    this.maxLength = maxLength;
  }

  getMockGeneratorFunction() {
    let generator;
    // If bounds are specified, generate a random string
    if(this.minLength > 0 || this.maxLength !== undefined) {
      generator = (faker: Faker) => faker.random.alphaNumeric(faker.datatype.number({min: this.minLength, max: this.maxLength}));
    } else {
      generator = (faker: Faker) => faker.random.word();
    }
    return new MockGeneratorFunction<string>(generator, this);
  }
}