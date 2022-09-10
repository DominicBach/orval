import {Value} from "./Value";
import {Field} from "../Field";
import {factory, PropertyAssignment} from "typescript";
import {ObjectValue} from "./ObjectValue";
import {PolymorphicObjectValue} from "./PolymorphicObjectValue";
import {Maybe} from "./Maybe";

export class SimpleObjectValue implements ObjectValue {
  readonly fields: Map<string, Field>

  constructor(fields: Field[] | Map<string, Field>) {
    if(Array.isArray(fields)) {
      this.fields = fields.reduce((map, field) => {
        map.set(field.name, field);
        return map;
      }, new Map<string, Field>())
    } else {
      this.fields = new Map(fields);
    }
  }

  getGeneratorAst() {
    const props: PropertyAssignment[] = [];
    for (const field of this.fields.values()) {
      // Create keys as strings in case some identifiers have special characters
      const keyString = factory.createStringLiteral(field.name, true);
      if(field.required) {
        props.push(factory.createPropertyAssignment(keyString, field.type.getGeneratorAst()))
      } else {
        props.push(factory.createPropertyAssignment(keyString, new Maybe(field.type).getGeneratorAst()))
      }
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

    const merged = new Map(this.fields);
    for(const fieldSet of fragmentFields) {
      for(const [key,value] of fieldSet) {
        merged.set(key, value);
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