import {Value} from "./Value";
import {Field} from "../Field";
import {factory, PropertyAssignment} from "typescript";
import {ObjectValue} from "./ObjectValue";
import {PolymorphicObjectValue} from "./PolymorphicObjectValue";

export class SimpleObjectValue implements ObjectValue {
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

  withAllOf(fragments: Value[]) {
    const fragmentFields = fragments
    .filter((value): value is SimpleObjectValue => 'fields' in value) // Just ignore non-object values
    .flatMap(value => value.fields)

    const merged = [...this.fields];
    // When evaluating allOf, the last declaration appears to take precedence
    for(const field of fragmentFields.reverse()) {
      if(!merged.find(f => f.name === field.name)) {
        merged.push(field)
      }
    }
    return new SimpleObjectValue(merged);
  }

  withOneOf(fragments: Value[]) {
    const extendedFragments = fragments
    .filter((value): value is SimpleObjectValue => 'fields' in value)
    .map(value => value.withAllOf([this]))
    return new PolymorphicObjectValue(extendedFragments);
  }
}