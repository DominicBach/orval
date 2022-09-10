import {Value} from "./Value";
import {PolymorphicType} from "./PolymorphicType";

export interface ObjectValue extends Value {

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
  withAllOf(fragments: Value[]): ObjectValue;

  /**
   * Creates subtypes from all the provided fragments, including the properties of this object.
   *
   * @param fragments
   */
  withOneOf(fragments: Value[]): PolymorphicType;

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
  withAnyOf(fragments: Value[]): PolymorphicType;

  /**
   * Return a copy of this object with none of the properties required.
   */
  partial(): ObjectValue;
}