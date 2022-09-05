import {BooleanValue} from "../BooleanValue";
import {isValidGenerator} from "./helper";

describe('BooleanValue', () => {
  it('has a valid mock generator', () => {
    const value = new BooleanValue();
    isValidGenerator(value);
  });
});

