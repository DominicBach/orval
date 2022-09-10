import {ObjectValue} from "./ObjectValue";
import {Expression, factory} from "typescript";
import {getRandomArrayElementAst} from "../AstGenerators";
import {Value} from "./Value";

export class PolymorphicType implements ObjectValue {

  readonly subtypes: ObjectValue[]

  constructor(subtypes: ObjectValue[]) {
    this.subtypes = subtypes;
  }

  getGeneratorAst(): Expression {
    const subtypesAst = factory.createArrayLiteralExpression(this.subtypes.map(t => t.getGeneratorAst()))
    return getRandomArrayElementAst(subtypesAst);
  }

  partial(): PolymorphicType {
    return new PolymorphicType(this.subtypes.map(type => type.partial()));
  }

  withAllOf(fragments: Value[]): PolymorphicType {
    return new PolymorphicType(this.subtypes.map(type => type.withAllOf(fragments)));
  }

  withAnyOf(fragments: Value[]): PolymorphicType {
    return new PolymorphicType(this.subtypes.map(type => type.withAnyOf(fragments)));
  }

  withOneOf(fragments: Value[]): PolymorphicType {
    return new PolymorphicType(this.subtypes.map(type => type.withOneOf(fragments)));
  }


}