import {Value} from "./Value";
import {getProducerFunction} from "../AstGenerators";
import {fakerGenerator} from "../FakerGenerator";

export class Maybe<T extends Value> implements Value {
  readonly value: T;
  readonly probability?: number;

  constructor(value: T, probability?: number) {
    this.value = value;
    this.probability = probability;
  }

  getGeneratorAst() {
    const producer = getProducerFunction(this.value.getGeneratorAst());
    if (this.probability)
      return fakerGenerator.helpers.maybe(producer, { probability: this.probability })
    else
      return fakerGenerator.helpers.maybe(producer)
  }
}