import {Value} from "./Value";
import {getMinMaxRangeAst, getRandomNumberAst} from "./AstGenerators";

export interface NumberValueBounds {
  minimum?: number,
  maximum?: number,
  // As of Swagger 3.1, exclusiveMinimum and exclusiveMaximum
  // are now booleans accompanying minimum and maximum
  exclusiveMinimum?: number | boolean,
  exclusiveMaximum?: number | boolean
}

export class NumberValue implements Value {
  readonly minimum?: number;
  readonly maximum?: number;

  constructor({minimum, maximum, exclusiveMinimum, exclusiveMaximum}: NumberValueBounds) {
    if(typeof exclusiveMinimum === 'boolean') {
      this.minimum = (minimum !== undefined && exclusiveMinimum) ? minimum + 1 : minimum;
    } else {
      this.minimum = (exclusiveMinimum !== undefined) ? exclusiveMinimum + 1 : minimum;
    }

    if(typeof exclusiveMaximum === 'boolean') {
      this.minimum = (maximum !== undefined && exclusiveMaximum) ? maximum - 1 : maximum;
    } else {
      this.minimum = (exclusiveMaximum !== undefined) ? exclusiveMaximum - 1 : maximum;
    }
  }

  getGeneratorAst() {
    if(this.minimum !== undefined || this.maximum !== undefined) {
      return getRandomNumberAst(getMinMaxRangeAst(this.minimum, this.maximum));
    } else {
      return getRandomNumberAst();
    }
  }
}