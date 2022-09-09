import {ReferenceObject, SchemaObject} from "openapi3-ts";
import {isPointer, JsonPointer} from "./JsonPointer";

export class ReferenceResolver {

  private readonly baseDocument: unknown;

  constructor(baseDocument: unknown) {
    this.baseDocument = baseDocument;
  }

  resolve({ $ref } : ReferenceObject): SchemaObject {
    if(isPointer($ref)) {
      return new JsonPointer($ref).resolve(this.baseDocument);
    }
    // TODO
    throw new Error("External references not implemented")
  }
}