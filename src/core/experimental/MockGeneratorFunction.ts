import {Faker} from "@faker-js/faker";

/**
 * Holds a function that generates a mock with context information.
 *
 */
export class MockGeneratorFunction<T> {
  readonly generator: (faker: Faker) => T;
  readonly context: unknown;

  constructor(generator: (faker: Faker) => T, context: unknown) {
    this.generator = generator;
    this.context = context;
  }

  inlineContext(): (faker: Faker) => T {
    // Get the source representation of the generator function
    let functionString = this.generator.toString();
    // The generator function should be an anonymous function within a Value instance.
    // If it makes references to fields of the value class, it will reference it as '_this'
    // We try to capture _this followed by any parameter access or function call using alphanumeric matches
    // This will only work if values respect a standard naming convention
    // This matcher matches repeated property access and function calls, such as
    // _this.a.b.c, _this.a().b().c(), or _this.a().b.c().d
    const matches = functionString.matchAll(/_this(\.\w+(\(\))?)+(\(\))?/g)
    for (const match of matches ?? []) {
      const expressionText = match[0];
      // Evaluate the "_this" reference against the context
      // We have to trim the underscore since "this" no longer references an outer instance
      const expression = Function('return ' + expressionText.substring(1)).bind(this.context);
      const result = expression();
      // Replace the expression with the result to inline it
      if(result === undefined) {
        functionString = functionString.replace(expressionText, 'undefined');
      } else if (typeof result === 'function') {
        // Wrap inlined functions with parentheses to they can be invoked
        functionString = functionString.replace(expressionText, `(${result.toString()})`);
      } else {
        functionString = functionString.replace(expressionText, JSON.stringify(result));
      }
    }

    // Convert back to arrow function
    functionString = functionString.replace("function (faker)", "(faker) =>")

    return Function('return ' + functionString)();
  }
}