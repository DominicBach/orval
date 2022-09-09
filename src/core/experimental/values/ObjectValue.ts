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
      const keyString = factory.createStringLiteral(field.name, true);
      props.push(factory.createPropertyAssignment(keyString, field.type.getGeneratorAst()))
    }
    return factory.createObjectLiteralExpression(props)
  }
}