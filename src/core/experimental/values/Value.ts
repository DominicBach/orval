import {Expression} from "typescript";

export interface Value {
  getGeneratorAst(): Expression;
}