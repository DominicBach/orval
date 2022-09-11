import {ArrowFunction, Expression} from "typescript";
import {getObjectLiteralAst, NestableSimpleObject, toCallExpression} from "./AstGenerators";

export const fakerGenerator = {
  datatype: {
    boolean() {
      return toCallExpression("faker.datatype.boolean")
    },
    number(options?: number | { min?: number, max?: number, precision?: number }) {
      return toCallExpression(
          "faker.datatype.number",
          typeof options === "number" ? options : literalIfPresent(options)
      )
    }
  },
  helpers: {
    maybe(producer: ArrowFunction, config?: { probability?: number }) {
      return toCallExpression(
          "faker.helpers.maybe",
          producer,
          literalIfPresent(config)
      );
    },
    arrayElement(array: Expression) {
      return toCallExpression(
          "faker.helpers.arrayElement",
          array
      )
    }
  },
  random: {
    word() {
      return toCallExpression("faker.random.word")
    },
    alphaNumeric(count?: number | Expression) {
      return toCallExpression(
          "faker.random.alphaNumeric",
          count
      )
    }
  }
}

function literalIfPresent(arg?: NestableSimpleObject) {
  if(arg === undefined) {
    return undefined;
  }
  return getObjectLiteralAst(arg, true);
}