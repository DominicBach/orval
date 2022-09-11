import {
  ArrowFunction,
  Expression,
  factory,
  ObjectLiteralExpression,
  PropertyAssignment,
  SyntaxKind
} from "typescript";

export function toCallExpression(expression: string, ...args: Array<Expression | SimpleType>) {
  const identifiers = expression.split('.')
  .map(identifier => factory.createIdentifier(identifier));

  let accessExpression = factory.createPropertyAccessExpression(
      identifiers[0], identifiers[1]
  );
  for (let i = 2; i < identifiers.length; i++) {
    accessExpression = factory.createPropertyAccessExpression(
        accessExpression, identifiers[i]
    )
  }

  let simplifiedArgs: typeof args = [];
  // Simplify the call expression by omitting any 'undefined' args passed at the end
  for (let i = args.length - 1; i >= 0; i--) {
    // As soon as we encounter a defined arg, include the whole array to that point
    if (args[i] !== undefined) {
      simplifiedArgs = args.slice(0, i + 1);
    }
  }

  // Convert any remaining 'undefined' args to the undefined identifier expression
  const expressionArgs = simplifiedArgs.map(arg => {
    if (typeof arg === 'object' && arg !== null) {
      return arg;
    }
    return getSimpleTypeLiteral(arg);
  });

  return factory.createCallExpression(
      accessExpression,
      undefined,
      expressionArgs);
}

/**
 * Create an arrow function with the provided expression as body `() => body`
 *
 * @param expression
 */
export function getProducerFunction(expression: Expression): ArrowFunction {
  let wrappedExpression = expression;
  if (expression.kind === SyntaxKind.ObjectLiteralExpression) {
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

export interface NestableSimpleObject extends SimpleObject<NestableSimpleObject> {
}

/**
 * Convert an object into AST that generates a literal of that object.
 *
 * @param object The object to generate AST of
 * @param excludeUndefined If true, object keys with a value of undefined will be omitted instead of explicitly declared undefined
 */
export function getObjectLiteralAst(object: NestableSimpleObject, excludeUndefined = false): ObjectLiteralExpression {
  const props: PropertyAssignment[] = [];
  for (const [key, value] of Object.entries(object)) {
    if (excludeUndefined && value === undefined) {
      continue;
    }
    if (typeof value === 'object' && value !== null) {
      props.push(factory.createPropertyAssignment(key, getObjectLiteralAst(value)))
    } else {
      props.push(factory.createPropertyAssignment(key, getSimpleTypeLiteral(value)))
    }
  }
  return factory.createObjectLiteralExpression(props);
}

export function getSimpleTypeLiteral(value: SimpleType) {
  if (value === null) {
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

type ExpressionObject = Record<string, Expression>;

/**
 * Get an object literal with property assignments for each key-value pair.
 *
 * @param object The object representing the property assignments.
 */
export function getExpressionObjectAst(object: ExpressionObject): ObjectLiteralExpression {
  const props = Object.entries(object)
  .map(([key, value]) => factory.createPropertyAssignment(key, value))
  return factory.createObjectLiteralExpression(props);
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