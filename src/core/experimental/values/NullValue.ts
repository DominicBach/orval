import {Value} from "./Value";
import {factory} from "typescript";

export class NullValue implements Value {

  readonly nullAsUndefined: boolean;

  constructor(nullAsUndefined?: boolean) {
    this.nullAsUndefined = Boolean(nullAsUndefined);
  }

  getGeneratorAst() {
    if(this.nullAsUndefined) {
      return factory.createIdentifier('undefined')
    }
    return factory.createNull();
  }
}