import {createPrinter, EmitHint, Expression, factory, NodeFlags, SyntaxKind} from "typescript";

const sourceFile = factory.createSourceFile([], factory.createToken(SyntaxKind.EndOfFileToken), NodeFlags.None);
const printer = createPrinter();

export function convertAstToString(ast: Expression) {
  return printer.printNode(EmitHint.Unspecified, ast, sourceFile);
}