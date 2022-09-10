import {Value} from "./Value";
import {getMaybeAst, getObjectLiteralAst, getProducerFunction} from "./AstGenerators";

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
      return getMaybeAst(producer, getObjectLiteralAst({probability: this.probability}));
    else
      return getMaybeAst(producer);
  }
}