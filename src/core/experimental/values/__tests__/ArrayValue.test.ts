import {StringValue} from "../StringValue";
import {ArrayValue} from "../ArrayValue";
import {isValidGenerator} from "./helper";

describe('ArrayValue', () => {
  it('has a valid mock generator', () => {
    const value = new ArrayValue(new StringValue());
    isValidGenerator(value);
  })
})