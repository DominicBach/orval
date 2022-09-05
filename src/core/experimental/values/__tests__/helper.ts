import {MockGenerator} from "../../MockGenerator";
import {faker} from "@faker-js/faker";

/**
 * Test that the provided generator returns a valid generator function that can be inlined and serialized to a string.
 *
 * @param generator The generator to test
 */
export function isValidGenerator(generator: MockGenerator<any>) {
  const functionString = generator.getMockGeneratorFunction().inlineContext().toString();

  expect(functionString).not.toContain('[native code]')

  const parsedFunction = Function('return ' + functionString)();
  expect(() => parsedFunction(faker)).not.toThrow();
}