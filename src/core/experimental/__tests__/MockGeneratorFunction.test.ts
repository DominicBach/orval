import {MockGeneratorFunction} from "../MockGeneratorFunction";
import {Faker} from "@faker-js/faker";

interface Context {
  value?: any;
  valueFunction?(): any;
  generator(faker: Faker): unknown;
}

describe('MockGeneratorFunction', () => {
  const valueCtx: Context = {
    value: 12345,
    generator: (faker) => {
      // @ts-ignore
      return faker.random.words(this.value)
    }
  };
  const valueFunctionCtx: Context ={
    valueFunction() {
      return 12345
    },
    generator: (faker) => {
      // @ts-ignore
      return faker.random.words(this.valueFunction!())
    }
  }
  describe('inlines values from the context', () => {
    test('when they are fields', () => {
      const mockGenerator = new MockGeneratorFunction(valueCtx.generator, valueCtx)
      const functionString = mockGenerator.inlineContext().toString();
      expect(functionString).toContain("12345")
    })
    test('when they are functions', () => {
      const mockGenerator = new MockGeneratorFunction(valueFunctionCtx.generator, valueFunctionCtx)
      const functionString = mockGenerator.inlineContext().toString();
      expect(functionString).toContain("12345")
    })
  })
  it('inlines numbers correctly', () => {
    const numberCtx = {
      value: 12345,
      generator: () => {
        // @ts-ignore
        return this.value;
      }
    }
    const mockGenerator = new MockGeneratorFunction(numberCtx.generator, numberCtx)
    const functionString = mockGenerator.inlineContext().toString();
    expect(functionString).toContain('return 12345;')
  })
  it('inlines strings correctly', () => {
    const numberCtx = {
      value: "a string of characters",
      generator: () => {
        // @ts-ignore
        return this.value;
      }
    }
    const mockGenerator = new MockGeneratorFunction(numberCtx.generator, numberCtx)
    const functionString = mockGenerator.inlineContext().toString();
    expect(functionString).toContain('return "a string of characters";')
  })
  it('inlines null correctly', () => {
    const numberCtx = {
      value: null,
      generator: () => {
        // @ts-ignore
        return this.value;
      }
    }
    const mockGenerator = new MockGeneratorFunction(numberCtx.generator, numberCtx)
    const functionString = mockGenerator.inlineContext().toString();
    expect(functionString).toContain('return null;')
  })
  it('inlines undefined correctly', () => {
    const numberCtx = {
      value: undefined,
      generator: () => {
        // @ts-ignore
        return this.value;
      }
    }
    const mockGenerator = new MockGeneratorFunction(numberCtx.generator, numberCtx)
    const functionString = mockGenerator.inlineContext().toString();
    expect(functionString).toContain('return undefined;')
  })
})