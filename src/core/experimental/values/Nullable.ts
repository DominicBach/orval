import {Value} from "./Value";
import {getRandomArrayElementAst} from "./AstGenerators";
import {factory} from "typescript";

export class Nullable<T extends Value> implements Value {

  readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  getGeneratorAst() {
    const valueOrNull = factory.createArrayLiteralExpression([
        this.value.getGeneratorAst(),
        factory.createNull()
    ])
    return getRandomArrayElementAst(valueOrNull)
  }


}