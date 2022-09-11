import {Value} from "./Value";
import {getArrayGeneratorAst, getExpressionObjectAst, getProducerFunction} from "../AstGenerators";
import {factory} from "typescript";
import {fakerGenerator} from "../FakerGenerator";

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
      const arrayLengthGenerator = fakerGenerator.datatype.number({
        min: this.minItems,
        max: this.maxItems
      })
      const arrayLengthArg = getExpressionObjectAst({length: arrayLengthGenerator});
      const itemGenerator = getProducerFunction(this.items.getGeneratorAst());
      return getArrayGeneratorAst(arrayLengthArg, itemGenerator);
    } else {
      return factory.createArrayLiteralExpression();
    }
  }
}