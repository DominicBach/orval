import {Value} from "./Value";
import {Field} from "../Field";
import {factory, PropertyAssignment} from "typescript";
import {ObjectValue} from "./ObjectValue";
import {PolymorphicType} from "./PolymorphicType";

export class SimpleObjectValue implements ObjectValue {
  readonly fields: Map<string, Field>

  constructor(fields: Field[] | Map<string, Field>) {
    if(Array.isArray(fields)) {
      // Remove duplicates, giving precedence to later fields
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
      props.push(field.getFieldAssignmentAst())
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
  withAllOf(fragments: Value[]): SimpleObjectValue {
    const fragmentFields = fragments
    .filter((value): value is SimpleObjectValue => 'fields' in value) // Just ignore non-object values
    .flatMap(value => value.fields)

    const merged = new Map(this.fields);
    for (const fieldSet of fragmentFields) {
      for (const [key, value] of fieldSet) {
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
  withOneOf(fragments: Value[]): PolymorphicType {
    const extendedFragments = fragments
    .filter((value): value is SimpleObjectValue => 'fields' in value)
    .map(value => value.withAllOf([this]))
    return new PolymorphicType(extendedFragments);
  }

  /**
   * Creates a union type in which the mandatory properties of at least one of the fragments must be present.
   *
   * AnyOf behaves similarly (but not exactly) like the typescript union type,
   * in which the keys of all fragments may be present, but the mandatory keys of *at least* one of
   * the objects must be there. In such a type, each fragment is a subtype, in which the fields of
   * all other subtypes are included as optional fields.
   *
   * @param fragments
   */
  withAnyOf(fragments: Value[]): PolymorphicType {
    // First, merge the subtypes with the properties of this object
    const subtypes = this.withOneOf(fragments).subtypes;
    // Then, to produce the union representation, for each subtype, merge the fields of the other subtypes as optional fields.
    const mergedTypes: ObjectValue[] = [];
    for (let i = 0; i < subtypes.length; i++) {
      let mergedType = subtypes[i];
      for (let j = 0; j < subtypes.length; j++) {
        if (j === i) {
          continue; // Don't merge the type with itself.
        }
        // Merge *into* subtype because of precedence rules favoring fields defined later
        mergedType = subtypes[j].partial().withAllOf([mergedType])
      }
      mergedTypes.push(mergedType);
    }
    return new PolymorphicType(mergedTypes);
  }

  /**
   * Return a copy of this object with none of the properties required.
   */
  partial() {
    const optionalFields = Array.from(this.fields.values())
    .map(f => f.optional());
    return new SimpleObjectValue(optionalFields);
  }
}