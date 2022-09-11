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
import {ObjectValue} from "./values/ObjectValue";
import {FormattedStringFactory, FormatHints} from "./FormattedStringFactory";

export class ValueFactory {

  private readonly referenceResolver;
  private readonly formattedStringFactory;

  constructor(referenceResolver: ReferenceResolver, formattedStringFactory: FormattedStringFactory) {
    this.referenceResolver = referenceResolver;
    this.formattedStringFactory = formattedStringFactory;
  }

  getValue(item: SchemaObject | ReferenceObject, hints?: FormatHints): Value {
    const schemaObject = isReference(item) ? this.referenceResolver.resolve(item) : item;

    if (schemaObject.nullable)
      return new Nullable(this.getValue({...item, nullable: false}));

    switch (schemaObject.type) {
      case 'string':
        return this.getString(schemaObject, hints);
      case 'boolean':
        return new BooleanValue();
      case "integer":
      case "number":
        return this.getNumber(schemaObject);
      case 'array':
        return this.getArray(schemaObject);
      case 'object':
        return this.getObject(schemaObject);
      case 'null':
      default:
        return new NullValue()
    }
  }

  private getObject(schemaObject: SchemaObject) {
    const fields = Object.entries(schemaObject.properties ?? {}).map(([key, value]) => (
        new Field(key, this.getValue(value, {keyName: key}), !!schemaObject.required?.includes(key))
    ));
    let object: ObjectValue = new SimpleObjectValue(fields);
    if (schemaObject.allOf) {
      const fragments = schemaObject.allOf.map(o => this.getValue(o))
      object = object.withAllOf(fragments);
    }
    if(schemaObject.anyOf) {
      const fragments = schemaObject.anyOf.map(o => this.getValue(o))
      object = object.withAnyOf(fragments);
    }
    if (schemaObject.oneOf) {
      const fragments = schemaObject.oneOf.map(o => this.getValue(o))
      object = object.withOneOf(fragments)
    }
    return object;
  }

  private getArray(schemaObject: SchemaObject) {
    const itemsSchema = schemaObject.items !== undefined ? this.getValue(schemaObject.items) : undefined;
    return new ArrayValue(itemsSchema, schemaObject.minItems, schemaObject.maxItems);
  }

  private getNumber(schemaObject: SchemaObject) {
    return new NumberValue({
      minimum: schemaObject.minimum,
      maximum: schemaObject.maximum,
      exclusiveMinimum: schemaObject.exclusiveMinimum,
      exclusiveMaximum: schemaObject.exclusiveMaximum
    });
  }

  private getString(schemaObject: SchemaObject, hints?: FormatHints) {
    if (schemaObject.enum) {
      return new EnumValue(schemaObject.enum.map(e => e.toString()));
    }
    return new StringValue(
        this.formattedStringFactory,
        { format: schemaObject.format, ...hints},
        schemaObject.minLength,
        schemaObject.maxLength);
  }
}

