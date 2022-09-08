import {Value} from "./Value";
import {getRandomBooleanAst} from "./AstGenerators";

export class BooleanValue implements Value {

  getGeneratorAst() {
    return getRandomBooleanAst();
  }
}