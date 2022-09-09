import {Value} from "./values/Value";
import {ReferenceObject, SchemaObject} from "openapi3-ts";
import {StringValue} from "./values/StringValue";
import {BooleanValue} from "./values/BooleanValue";
import {Nullable} from "./values/Nullable";
import {NumberValue} from "./values/NumberValue";
import {ArrayValue} from "./values/ArrayValue";
import {ReferenceResolver} from "./ReferenceResolver";
import {NullValue} from "./values/NullValue";
import {isReference} from "../../utils/is";
import {Field} from "./Field";
import {SimpleObjectValue} from "./values/SimpleObjectValue";
import {EnumValue} from "./values/EnumValue";

export class ValueFactory {

  private referenceResolver;

  constructor(referenceResolver: ReferenceResolver) {
    this.referenceResolver = referenceResolver;
  }

  getValue(item: SchemaObject | ReferenceObject): Value {
    const schemaObject = isReference(item) ? this.referenceResolver.resolve(item) : item;

    if (schemaObject.nullable)
      return new Nullable(this.getValue({...item, nullable: false}));

    switch (schemaObject.type) {
      case 'string':
        if(schemaObject.enum) {
          return new EnumValue(schemaObject.enum.map(e => e.toString()));
        }
        return new StringValue(schemaObject.minLength, schemaObject.maxLength);
      case 'boolean':
        return new BooleanValue();
      case "integer":
      case "number":
        return new NumberValue({
          minimum: schemaObject.minimum,
          maximum: schemaObject.maximum,
          exclusiveMinimum: schemaObject.exclusiveMinimum,
          exclusiveMaximum: schemaObject.exclusiveMaximum
        });
      case 'array':
        const itemsSchema = schemaObject.items ? this.getValue(schemaObject.items) : schemaObject.items;
        return new ArrayValue(itemsSchema, schemaObject.minItems, schemaObject.maxItems);
      case 'object':
        const fields = Object.entries(schemaObject.properties ?? {}).map(([key, value]) => ({
          name: key, type: this.getValue(value)
          } as Field));
        const object = new SimpleObjectValue(fields);
        if(schemaObject.allOf) {
          const fragments = schemaObject.allOf.map(o => this.getValue(o))
          return object.withAllOf(fragments);
        }
        if(schemaObject.oneOf) {
          const fragments = schemaObject.oneOf.map(o => this.getValue(o))
          return object.withOneOf(fragments)
        }
        return object;
      case 'null':
      default:
        return new NullValue()
    }
  }
}

