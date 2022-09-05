import {PrimitiveValue} from "./PrimitiveValue";
import {Faker} from "@faker-js/faker";
import {MockGeneratorFunction} from "../MockGeneratorFunction";

export class NumberValue implements PrimitiveValue<number> {
  readonly type = 'number';
  readonly minimum?: number;
  readonly maximum?: number;

  constructor(minimum?: number, maximum?: number, exclusiveMinimum?: boolean, exclusiveMaximum?: boolean) {
    this.minimum = (minimum !== undefined && exclusiveMinimum) ? minimum + 1 : minimum;
    this.maximum = (maximum !== undefined && exclusiveMaximum) ? maximum - 1 : maximum;
  }

  getMockGeneratorFunction() {
    const generator = (faker: Faker) => faker.datatype.number({min: this.minimum, max: this.maximum});
    return new MockGeneratorFunction<number>(generator, this);
  }
}