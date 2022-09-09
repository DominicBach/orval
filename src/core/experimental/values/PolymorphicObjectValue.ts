import {ObjectValue} from "./ObjectValue";
import {Expression, factory} from "typescript";
import {getRandomArrayElementAst} from "./AstGenerators";

export class PolymorphicObjectValue implements ObjectValue {

  readonly subtypes: ObjectValue[]

  constructor(subtypes: ObjectValue[]) {
    this.subtypes = subtypes;
  }

  getGeneratorAst(): Expression {
    const subtypesAst = factory.createArrayLiteralExpression(this.subtypes.map(t => t.getGeneratorAst()))
    return getRandomArrayElementAst(subtypesAst);
  }


}