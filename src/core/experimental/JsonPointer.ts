export class JsonPointer {

  private readonly tokens: readonly string[];
  private readonly pointer: string;

  constructor(pointer: string) {
    this.pointer = pointer;
    // https://datatracker.ietf.org/doc/html/draft-ietf-appsawg-json-pointer-04#section-4
    this.tokens = pointer.substring(2) // Remove leading #/
    .split("/")
    .map(token => token
    .replace("~0", "~")
    .replace("~1", "/"));
  }

  resolve<T = unknown>(document: unknown): T {
    let obj = document;
    for (const token of this.tokens) {
      if (!(typeof obj === 'object' && obj && token in obj)) {
        throw new Error(`Invalid reference ${this.pointer}: could not evaluate property ${token}`);
      }
      obj = obj[token as keyof typeof obj];
    }
    return obj as T;
  }
}

export function isPointer(string: String) {
  return string.trim().startsWith("#");
}