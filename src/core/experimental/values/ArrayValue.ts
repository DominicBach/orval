import {Value} from "./Value";
import {MockGeneratorFunction} from "../MockGeneratorFunction";
import {Faker} from "@faker-js/faker";

export class ArrayValue<T> implements Value<Array<T>> {
  readonly items: Value<T>;
  readonly minItems: number;
  readonly maxItems: number;

  constructor(items: Value<T>, minItems?: number, maxItems?: number) {
    this.items = items;
    this.minItems = minItems ?? 1;
    this.maxItems = maxItems ?? 10;
  }

  getMockGeneratorFunction() {
    const generator = (faker: Faker) => {
      return Array.from({ length: faker.datatype.number({min: this.minItems, max: this.maxItems})}, () => {
        return this.items.getMockGeneratorFunction().inlineContext()(faker);
      })
    }
    return new MockGeneratorFunction(generator, this);
  }
}