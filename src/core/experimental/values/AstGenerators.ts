import {
  ArrowFunction,
  CallExpression,
  Expression,
  factory,
  ObjectLiteralExpression,
  PropertyAssignment,
  SyntaxKind
} from "typescript";

/**
 * AST for `faker.helpers.arrayElement(array)`
 */
export function getRandomArrayElementAst(array: Expression) {
  return factory.createCallExpression(
      factory.createPropertyAccessExpression(
          factory.createPropertyAccessExpression(
              factory.createIdentifier('faker'),
              factory.createIdentifier('helpers')
          ),
          factory.createIdentifier('arrayElement')
      ),
      undefined,
      [array]
  )
}

/**
 * AST for `faker.datatype.boolean()`
 */
export function getRandomBooleanAst(): CallExpression {
  return factory.createCallExpression(
      factory.createPropertyAccessExpression(
          factory.createPropertyAccessExpression(
              factory.createIdentifier('faker'),
              factory.createIdentifier('datatype')
          ),
          factory.createIdentifier('boolean')
      ),
      undefined,
      undefined
  )
}

/**
 * AST for `faker.random.word()`
 */
export function getRandomWordAst(): CallExpression {
  return factory.createCallExpression(
      factory.createPropertyAccessExpression(
          factory.createPropertyAccessExpression(
              factory.createIdentifier('faker'),
              factory.createIdentifier('random')
          ),
          factory.createIdentifier('word')
      ),
      undefined,
      undefined
  )
}

/**
 * AST for `faker.random.alphaNumeric(args)`
 */
export function getRandomAlphanumericAst(args: Expression): CallExpression {
  return factory.createCallExpression(
      factory.createPropertyAccessExpression(
          factory.createPropertyAccessExpression(
              factory.createIdentifier('faker'),
              factory.createIdentifier('random')
          ),
          factory.createIdentifier('alphaNumeric')
      ),
      undefined,
      args ? [args] : args
  )
}

/**
 * AST for faker.datatype.number(args)
 */
export function getRandomNumberAst(args?: Expression): CallExpression {
  return factory.createCallExpression(
      factory.createPropertyAccessExpression(
          factory.createPropertyAccessExpression(
              factory.createIdentifier('faker'),
              factory.createIdentifier('datatype')
          ),
          factory.createIdentifier('number')
      ),
      undefined,
      args ? [args] : []
  );
}

/**
 * Create an arrow function with the provided expression as body `() => body`
 *
 * @param expression
 */
export function getProducerFunction(expression: Expression): ArrowFunction {
  let wrappedExpression = expression;
  if(expression.kind === SyntaxKind.ObjectLiteralExpression) {
    wrappedExpression = factory.createParenthesizedExpression(expression);
  }
  return factory.createArrowFunction(
      undefined,
      undefined,
      [],
      undefined,
      factory.createToken(SyntaxKind.EqualsGreaterThanToken),
      wrappedExpression
  )
}

type SimpleType = string | boolean | number | null | undefined;
interface SimpleObject<T> {
  [key: string]: SimpleType | T
}
interface NestableSimpleObject extends SimpleObject<NestableSimpleObject> {}

/**
 * Convert an object into AST that generates a literal of that object.
 *
 * @param object The object to generate AST of
 * @param excludeUndefined If true, object keys with a value of undefined will be omitted instead of explicitly declared undefined
 */
export function getObjectLiteralAst(object: NestableSimpleObject, excludeUndefined = false): ObjectLiteralExpression {
  const props: PropertyAssignment[] = [];
  for(const [key, value] of Object.entries(object)) {
    if(excludeUndefined && value === undefined) {
      continue;
    }
    if(typeof value === 'object' && value !== null) {
      props.push(factory.createPropertyAssignment(key, getObjectLiteralAst(value)))
    } else {
      props.push(factory.createPropertyAssignment(key, getSimpleTypeLiteral(value)))
    }
  }
  return factory.createObjectLiteralExpression(props);
}

export function getSimpleTypeLiteral(value: SimpleType) {
  if(value === null) {
    return factory.createNull();
  }
  switch (typeof value) {
    case 'string':
      return factory.createStringLiteral(value);
    case "boolean":
      return value ? factory.createTrue() : factory.createFalse();
    case "number":
      return factory.createNumericLiteral(value);
    case 'undefined':
    default:
      return factory.createIdentifier('undefined');
  }
}

/**
 * AST for object literal of shape `{ length: Expression}`
 */
export function getLengthArgAst(length: Expression) {
  return factory.createObjectLiteralExpression([
    factory.createPropertyAssignment('length', length)
  ]);
}

/**
 * AST for Array.from(...args)
 * @param args
 */
export function getArrayGeneratorAst(...args: Expression[]) {
  return factory.createCallExpression(
      factory.createPropertyAccessExpression(
          factory.createIdentifier('Array'),
          factory.createIdentifier('from'),
      ),
      undefined,
      args);
}