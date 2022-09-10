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

  /**
   * Merges all the properties of the fragments into a single object.
   *
   * Duplicate keys: https://datatracker.ietf.org/doc/html/draft-wright-json-schema-00#section-4.2
   * Section 4.2 of the JSON Schema specification states that
   * >  Since an object cannot have two properties with the same key,
   *    behavior for a JSON document that tries to define two properties (the
   *    "member" production) with the same key (the "string" production) in a
   *    single object is undefined.
   *
   * In case of duplicated properties, precedence is given to the last declaration.
   * This appears to be consistent with the behaviour of the Swagger generated models.
   *
   * @param fragments The object fragments. Non-object values are ignored
   */
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

  /**
   * Creates subtypes from all the provided fragments, including the properties of this object.
   *
   * @param fragments
   */
  withOneOf(fragments: Value[]) {
    const extendedFragments = fragments
    .filter((value): value is SimpleObjectValue => 'fields' in value)
    .map(value => value.withAllOf([this]))
    return new PolymorphicObjectValue(extendedFragments);
  }
}