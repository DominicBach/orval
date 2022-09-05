import {faker} from "@faker-js/faker";
import {isValidGenerator} from "./helper";
import {NumberValue} from "../NumberValue";

describe('StringValue', () => {
  it('handles min > max', () => {
    const value = new NumberValue(100, 0);
    expect(() => value.getMockGeneratorFunction().generator(faker)).not.toThrow();
  })
  it.each([
      [undefined, undefined],
      [10, undefined],
      [undefined, 10],
      [10, 100]
  ])('has a valid mock generator when min %p and max %p', (min?: number, max?: number) => {
    const value = new NumberValue(min, max);
    isValidGenerator(value);
  })
})

