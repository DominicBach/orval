import {ObjectValue} from "./ObjectValue";
import {Expression, factory} from "typescript";
import {getRandomArrayElementAst} from "./AstGenerators";
import {SimpleObjectValue} from "./SimpleObjectValue";

export class TypeList implements ObjectValue {

  readonly types: SimpleObjectValue[]

  constructor(types: SimpleObjectValue[]) {
    this.types = types;
  }

  getGeneratorAst(): Expression {
    const subtypesAst = factory.createArrayLiteralExpression(this.types.map(t => t.getGeneratorAst()))
    return getRandomArrayElementAst(subtypesAst);
  }


}