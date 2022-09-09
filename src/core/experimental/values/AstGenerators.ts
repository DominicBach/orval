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

/**
 * AST for object literal of shape { min?: number, max?: number}
 */
export function getMinMaxRangeAst(min?: number, max?: number): ObjectLiteralExpression {
  const props: PropertyAssignment[] = [];
  if (min !== undefined) {
    props.push(factory.createPropertyAssignment('min', factory.createNumericLiteral(min)))
  }
  if (max !== undefined) {
    props.push(factory.createPropertyAssignment('max', factory.createNumericLiteral(max)))
  }

  return factory.createObjectLiteralExpression(props);
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