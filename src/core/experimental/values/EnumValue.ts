import {Value} from "./Value";
import {factory} from "typescript";
import {fakerGenerator} from "../FakerGenerator";

export class EnumValue implements Value {

  readonly constants: string[]

  constructor(constants: string[]) {
    this.constants = [...constants];
  }

  getGeneratorAst() {
    const arrayItems = this.constants.map(c=> factory.createStringLiteral(c));
    const enumArray = factory.createArrayLiteralExpression(arrayItems);
    return fakerGenerator.helpers.arrayElement(enumArray);
  }

}