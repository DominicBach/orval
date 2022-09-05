import {PrimitiveValue} from "./PrimitiveValue";
import {MockGeneratorFunction} from "../MockGeneratorFunction";
import {Faker} from "@faker-js/faker";

export class BooleanValue implements PrimitiveValue<boolean> {
  readonly type = 'boolean';

  getMockGeneratorFunction() {
    const generator = (faker: Faker) => faker.datatype.boolean();
    return new MockGeneratorFunction(generator, this);
  }

}