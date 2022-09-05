import {Value} from "./Value";

export interface PrimitiveValue<T> extends Value<T> {
  readonly type: 'string' | 'number' | 'boolean';
}