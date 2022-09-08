import { DEFAULT_FORMAT_MOCK } from '../../constants/format.mock';
import { ContextSpecs, MockOptions } from '../../types';
import { GeneratorImport } from '../../types/generator';
import { MockDefinition, MockSchemaObject } from '../../types/mocks';
import { isReference, isRootKey } from '../../utils/is';
import { mergeDeep } from '../../utils/mergeDeep';
import { escape } from '../../utils/string';
import {
  getNullable,
  resolveMockOverride,
  resolveMockValue,
} from '../resolvers/value.mock';
import { getMockObject } from './object.mock';
import {NumberValue} from "../experimental/values/NumberValue";
import {Nullable} from "../experimental/values/Nullable";
import {convertAstToString} from "../experimental/AstStringGenerator";
import {BooleanValue} from "../experimental/values/BooleanValue";
import {StringValue} from "../experimental/values/StringValue";
import {ArrayValue} from "../experimental/values/ArrayValue";

export const getMockScalar = ({
  item,
  imports,
  mockOptions,
  operationId,
  tags,
  combine,
  context,
}: {
  item: MockSchemaObject;
  imports: GeneratorImport[];
  mockOptions?: MockOptions;
  operationId: string;
  isRef?: boolean;
  tags: string[];
  combine?: {
    separator: 'allOf' | 'oneOf' | 'anyOf';
    includedProperties: string[];
  };
  context: ContextSpecs;
}): MockDefinition => {
  const operationProperty = resolveMockOverride(
    mockOptions?.operations?.[operationId]?.properties,
    item,
  );

  if (operationProperty) {
    return operationProperty;
  }

  const overrideTag = Object.entries(mockOptions?.tags ?? {}).reduce<{
    properties: Record<string, string>;
  }>(
    (acc, [tag, options]) =>
      tags.includes(tag) ? mergeDeep(acc, options) : acc,
    {} as { properties: Record<string, string> },
  );

  const tagProperty = resolveMockOverride(overrideTag?.properties, item);

  if (tagProperty) {
    return tagProperty;
  }

  const property = resolveMockOverride(mockOptions?.properties, item);

  if (property) {
    return property;
  }

  const ALL_FORMAT: Record<string, string> = {
    ...DEFAULT_FORMAT_MOCK,
    ...(mockOptions?.format ?? {}),
  };

  if (item.format && ALL_FORMAT[item.format]) {
    return {
      value: getNullable(ALL_FORMAT[item.format], item.nullable),
      imports: [],
      name: item.name,
      overrided: false,
    };
  }

  switch (item.type) {
    case 'number':
    case 'integer': {
      const generator = new NumberValue({
        minimum: item.minimum,
        maximum: item.maximum,
        exclusiveMinimum: item.exclusiveMinimum,
        exclusiveMaximum: item.exclusiveMaximum
      });
      const wrapped = item.nullable ? new Nullable(generator) : generator;
      return {
        value: convertAstToString(wrapped.getGeneratorAst()),
        imports: [],
        name: item.name,
      };
    }

    case 'boolean': {
      return {
        value: convertAstToString(new BooleanValue().getGeneratorAst()),
        imports: [],
        name: item.name,
      };
    }

    case 'array': {
      if (!item.items) {
        return { value: convertAstToString(new ArrayValue().getGeneratorAst()), imports: [], name: item.name };
      }

      const {
        value,
        enums,
        imports: resolvedImports,
        name,
      } = resolveMockValue({
        schema: {
          ...item.items,
          name: item.name,
          path: item.path ? `${item.path}.[]` : '#.[]',
        },
        combine,
        mockOptions,
        operationId,
        tags,
        context,
        imports,
      });

      if (enums) {
        if (!isReference(item.items)) {
          return {
            value,
            imports: resolvedImports,
            name: item.name,
          };
        }

        const enumImp = imports.find(
          (imp) => name.replace('[]', '') === imp.name,
        );
        const enumValue = enumImp?.name || name;
        return {
          value: `faker.helpers.arrayElements(Object.values(${enumValue}))`,
          imports: enumImp
            ? [
                ...resolvedImports,
                {
                  ...enumImp,
                  values: true,
                  ...(!isRootKey(context.specKey, context.target)
                    ? { specKey: context.specKey }
                    : {}),
                },
              ]
            : resolvedImports,
          name: item.name,
        };
      }

      return {
        value:
          `Array.from({ length: faker.datatype.number({ ` +
          `min: ${mockOptions?.arrayMin}, ` +
          `max: ${mockOptions?.arrayMax} }) ` +
          `}, (_, i) => i + 1).map(() => (${value}))`,
        imports: resolvedImports,
        name: item.name,
      };
    }

    case 'string': {
      let value;
      let imports: GeneratorImport[] = [];

      if (item.enum) {
        let enumValue =
          "['" + item.enum.map((e) => escape(e)).join("','") + "']";

        if (item.isRef) {
          enumValue = `Object.values(${item.name})`;
          imports = [
            {
              name: item.name,
              values: true,
              ...(!isRootKey(context.specKey, context.target)
                ? { specKey: context.specKey }
                : {}),
            },
          ];
        }

        value = `faker.helpers.arrayElement(${enumValue})`;
      } else {
        value = convertAstToString(new StringValue(item.minLength, item.maxLength).getGeneratorAst());
      }

      return {
        value: getNullable(value, item.nullable),
        enums: item.enum,
        name: item.name,
        imports,
      };
    }

    case 'object':
    default: {
      return getMockObject({
        item,
        mockOptions,
        operationId,
        tags,
        combine,
        context,
        imports,
      });
    }
  }
};
