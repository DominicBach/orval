import {MockGeneratorFunction} from "./MockGeneratorFunction";

export interface MockGenerator<T> {
  /**
   * Create a function that generates a mock value from a faker instance.
   *
   */
  getMockGeneratorFunction(): MockGeneratorFunction<T>;

}