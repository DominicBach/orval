import {StringValue} from "../StringValue";
import {faker} from "@faker-js/faker";
import {isValidGenerator} from "./helper";

describe('NumberValue', () => {
  it('handles min > max', () => {
    const value = new StringValue(100, 0);
    expect(() => value.getMockGeneratorFunction().generator(faker)).not.toThrow();
  })
  it.each([
      [undefined, undefined],
      [10, undefined],
      [undefined, 10],
      [10, 100]
  ])('has a valid mock generator when min %p and max %p', (min?: number, max?: number) => {
    const value = new StringValue(min, max);
    isValidGenerator(value);
  })
})

