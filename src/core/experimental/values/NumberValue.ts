import {Value} from "./Value";
import {getMinMaxRangeAst, getRandomNumberAst} from "./AstGenerators";

export class NumberValue implements Value {
  readonly minimum?: number;
  readonly maximum?: number;

  constructor(minimum?: number, maximum?: number, exclusiveMinimum?: boolean, exclusiveMaximum?: boolean) {
    this.minimum = (minimum !== undefined && exclusiveMinimum) ? minimum + 1 : minimum;
    this.maximum = (maximum !== undefined && exclusiveMaximum) ? maximum - 1 : maximum;
  }

  getGeneratorAst() {
    return getRandomNumberAst(getMinMaxRangeAst(this.minimum, this.maximum));
  }
}