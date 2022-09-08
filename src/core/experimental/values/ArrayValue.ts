import {Value} from "./Value";
import {
  getArrayGeneratorAst,
  getLengthArgAst,
  getMinMaxRangeAst,
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
      const arrayLengthGenerator = getRandomNumberAst(getMinMaxRangeAst(this.minItems, this.maxItems));
      const arrayLengthArg = getLengthArgAst(arrayLengthGenerator);
      const itemGenerator = this.items.getGeneratorAst();
      return getArrayGeneratorAst(arrayLengthArg, itemGenerator);
    } else {
      return factory.createArrayLiteralExpression();
    }
  }
}