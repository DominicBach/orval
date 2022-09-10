import {Value} from "./Value";
import {getObjectLiteralAst, getRandomNumberAst} from "../AstGenerators";

export interface NumberValueValidations {
  minimum?: number,
  maximum?: number,
  // As of Swagger 3.1, exclusiveMinimum and exclusiveMaximum
  // are now booleans accompanying minimum and maximum
  exclusiveMinimum?: number | boolean,
  exclusiveMaximum?: number | boolean
  format?: string
}

export class NumberValue implements Value {
  readonly minimum?: number;
  readonly maximum?: number;
  readonly precision?: number;

  constructor({minimum, maximum, exclusiveMinimum, exclusiveMaximum, format}: NumberValueValidations) {
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

    if(format && ['float', 'double'].includes(format)) {
      this.precision = 0.01;
    }
  }

  getGeneratorAst() {
    if(this.minimum !== undefined || this.maximum !== undefined) {
      return getRandomNumberAst(getObjectLiteralAst({
        min: this.minimum,
        max: this.maximum,
        precision: this.precision
      }, true));
    } else {
      return getRandomNumberAst();
    }
  }
}