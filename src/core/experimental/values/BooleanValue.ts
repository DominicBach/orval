import {Value} from "./Value";
import {fakerGenerator} from "../FakerGenerator";

export class BooleanValue implements Value {

  getGeneratorAst() {
    return fakerGenerator.datatype.boolean();
  }
}