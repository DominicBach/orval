import {Value} from "./Value";
import {Field} from "../Field";
import {factory, PropertyAssignment} from "typescript";

export class ObjectValue implements Value {
  readonly fields: Field[];

  constructor(fields: Field[]) {
    this.fields = fields;
  }

  getGeneratorAst() {
    const props: PropertyAssignment[] = [];
    for (const field of this.fields) {
      props.push(factory.createPropertyAssignment(field.name, field.type.getGeneratorAst()))
    }
    return factory.createObjectLiteralExpression(props)
  }
}