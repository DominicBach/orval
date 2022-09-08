import {Value} from "./values/Value";

export interface Field {
  readonly name: string;
  readonly type: Value;
}