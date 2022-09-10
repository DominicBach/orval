import {Value} from "./values/Value";
import {factory} from "typescript";
import {Maybe} from "./values/Maybe";

export class Field {
  readonly name: string;
  readonly type: Value;
  readonly required?: boolean;

  constructor(name: string, type: Value, required: boolean) {
    this.name = name;
    this.type = type;
    this.required = required;
  }

  getFieldAssignmentAst() {
    // Create keys as strings in case some identifiers have special characters
    const keyString = factory.createStringLiteral(this.name, true);
    if(this.required) {
      return factory.createPropertyAssignment(keyString, this.type.getGeneratorAst());
    } else {
      return factory.createPropertyAssignment(keyString, new Maybe(this.type).getGeneratorAst());
    }
  }

  /**
   * Get an optional version of this field.
   */
  optional() {
    return new Field(this.name, this.type, false);
  }
}