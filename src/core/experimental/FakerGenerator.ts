import {ArrowFunction, Expression} from "typescript";
import {getObjectLiteralAst, NestableSimpleObject, toCallExpression} from "./AstGenerators";

export const fakerGenerator = {
  address: {
    city() {
      return toCallExpression("faker.address.city");
    },
    country() {
      return toCallExpression("faker.address.country");
    },
    streetName() {
      return toCallExpression("faker.address.streetName");
    },
    zipCode() {
      return toCallExpression("faker.address.zipCode");
    }
  },
  datatype: {
    boolean() {
      return toCallExpression("faker.datatype.boolean")
    },
    number(options?: number | { min?: number, max?: number, precision?: number }) {
      return toCallExpression(
          "faker.datatype.number",
          typeof options === "number" ? options : literalIfPresent(options)
      )
    },
    uuid() {
      return toCallExpression("faker.datatype.uuid");
    }
  },
  date: {
    past(years?: number | Expression) {
      return toCallExpression("faker.date.past", years)
    },
    future(years?: number | Expression) {
      return toCallExpression("faker.date.future", years)
    }
  },
  finance: {
    bic() {
      return toCallExpression("faker.finance.bic");
    },
    iban() {
      return toCallExpression("faker.finance.iban");
    }
  },
  helpers: {
    arrayElement(array: Expression) {
      return toCallExpression(
          "faker.helpers.arrayElement",
          array
      )
    },
    maybe(producer: ArrowFunction, config?: { probability?: number }) {
      return toCallExpression(
          "faker.helpers.maybe",
          producer,
          literalIfPresent(config)
      );
    },
  },
  internet: {
    email() {
      return toCallExpression("faker.internet.email");
    },
    ipv4() {
      return toCallExpression("faker.internet.ipv4");
    },
    ipv6() {
      return toCallExpression("faker.internet.ipv6");
    },
    password() {
      return toCallExpression("faker.internet.password");
    },
    url() {
      return toCallExpression("faker.internet.url");
    },
    userName() {
      return toCallExpression("faker.internet.userName");
    }
  },
  name: {
    firstName() {
      return toCallExpression("faker.name.firstName");
    },
    gender() {
      return toCallExpression("faker.name.gender");
    },
    jobTitle() {
      return toCallExpression("faker.name.jobTitle");
    },
    lastName() {
      return toCallExpression("faker.name.lastName");
    },
    phoneNumber() {
      return toCallExpression("faker.phone.phoneNumber");
    }
  },
  random: {
    alphaNumeric(count?: number | Expression) {
      return toCallExpression(
          "faker.random.alphaNumeric",
          count
      )
    },
    word() {
      return toCallExpression("faker.random.word")
    }
  }
}

function literalIfPresent(arg?: NestableSimpleObject) {
  if (arg === undefined) {
    return undefined;
  }
  return getObjectLiteralAst(arg, true);
}