import {Value} from "./Value";
import {
  getArrayGeneratorAst,
  getExpressionObjectAst,
  getObjectLiteralAst,
  getProducerFunction,
  getRandomNumberAst
} from "./AstGenerators";
import {factory} from "typescript";

export class ArrayValue implements Value {
  readonly items?: Value;
  readonly minItems: number;
  readonly maxItems: number;

  constructor(items?: Value, minItems?: number, maxItems?: number) {
    this.items = items;
    this.minItems = minItems ?? 1;
    this.maxItems = maxItems ?? 10;
  }

  getGeneratorAst() {
    if(this.items) {
      const arrayLengthGenerator = getRandomNumberAst(getObjectLiteralAst({
        min: this.minItems,
        max: this.maxItems
      }, true));
      const arrayLengthArg = getExpressionObjectAst({length: arrayLengthGenerator});
      const itemGenerator = getProducerFunction(this.items.getGeneratorAst());
      return getArrayGeneratorAst(arrayLengthArg, itemGenerator);
    } else {
      return factory.createArrayLiteralExpression();
    }
  }
}