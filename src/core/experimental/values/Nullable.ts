import {Value} from "./Value";
import {factory} from "typescript";
import {NullValue} from "./NullValue";
import {fakerGenerator} from "../FakerGenerator";

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
    return fakerGenerator.helpers.arrayElement(valueOrNull)
  }


}