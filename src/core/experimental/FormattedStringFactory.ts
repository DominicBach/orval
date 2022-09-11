import {Expression, factory} from "typescript";
import {fakerGenerator} from "./FakerGenerator";

export interface FormatHints {
  format?: string;
  keyName?: string;
}

export class FormattedStringFactory {

  getFormattedString(hints: FormatHints): Expression | undefined {
    return resolveHint(hints.format) ??
        resolveHint(hints.keyName);
  }
}

function normalize(hint: string) {
  return hint
  .toLowerCase()
  .replace(/[^a-z0-9]/gi, '');
}

function resolveHint(hint?: string) {
  if (!hint)
    return undefined;
  return standardHints.get(normalize(hint));
}

const standardHints = new Map<string, Expression>();
standardHints.set('bic', fakerGenerator.finance.bic());
standardHints.set('city', fakerGenerator.address.city());
standardHints.set('country', fakerGenerator.address.country());
standardHints.set('email', fakerGenerator.internet.email());
standardHints.set('firstname', fakerGenerator.name.firstName());
standardHints.set('gender', fakerGenerator.name.gender());
standardHints.set('iban', fakerGenerator.finance.iban());
standardHints.set('ipv4', fakerGenerator.internet.ipv4());
standardHints.set('ipv6', fakerGenerator.internet.ipv6());
standardHints.set('jobtitle', fakerGenerator.name.jobTitle());
standardHints.set('lastname', fakerGenerator.name.lastName());
standardHints.set('password', fakerGenerator.internet.password());
standardHints.set('phonenumber', fakerGenerator.phone.phoneNumber());
standardHints.set('streetname', fakerGenerator.address.streetName());
standardHints.set('uri', fakerGenerator.internet.url());
standardHints.set('url', fakerGenerator.internet.url());
standardHints.set('username', fakerGenerator.internet.userName());
standardHints.set('uuid', fakerGenerator.datatype.uuid());
standardHints.set('zipcode', fakerGenerator.address.zipCode());
standardHints.set('date', getDate());
standardHints.set('datetime', getDateTime());

function getIsoString() {
  const toIsoDate = factory.createPropertyAccessExpression(
      fakerGenerator.date.past(),
      'toISOString')
  return factory.createCallExpression(
      toIsoDate,
      undefined,
      undefined
  )
}

function splitIsoString(char: string) {
  const split = factory.createPropertyAccessExpression(getIsoString(), 'split');
  return factory.createCallExpression(
      split,
      undefined,
      [factory.createStringLiteral(char)]
  )
}

function getDate() {
  return factory.createElementAccessExpression(
      splitIsoString('T'),
      factory.createNumericLiteral(0)
  );
}

function getDateTime() {
  return factory.createTemplateExpression(
      factory.createTemplateHead(""),
      [
        factory.createTemplateSpan(
            factory.createElementAccessExpression(
                splitIsoString('.'),
                factory.createNumericLiteral(0)),
            factory.createTemplateTail(
                "Z",
                "Z"
            ))
      ]
  );
}