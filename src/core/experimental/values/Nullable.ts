import {Value} from "./Value";
import {getRandomArrayElementAst} from "./AstGenerators";
import {factory} from "typescript";
import {NullValue} from "./NullValue";

export class Nullable<T extends Value> implements Value {

  readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  getGeneratorAst() {
    const valueOrNull = factory.createArrayLiteralExpression([
        this.value.getGeneratorAst(),
        new NullValue().getGeneratorAst()
    ])
    return getRandomArrayElementAst(valueOrNull)
  }


}