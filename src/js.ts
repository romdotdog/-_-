import Block, { GenericSyntax, SerializedGenericSyntax } from "q";
import { lexer, parser } from "./parser";
import { binaryOperators, unaryOperators } from "./ops";

const makeSyntax = (source: string): GenericSyntax => ({
	source: [
		{
			type: "JS",
			source: [source],
			debugInfo: [0, 0]
		}
	],
	groups: []
});

let opFuncs: Record<string, Function> = {};
export default <Block>{
	lex: lexer,
	parse: parser,
	gen: {
		syntaxes: {
			root: {
				visit: (syntax) => {
					console.log(syntax);
					while (syntax.groups.length != 1) {
						const opGroup = syntax.groups[1];
						console.log(opGroup);
						if (opGroup?.type === "binaryOperator") {
							const opTok = opGroup.source[0];
							const op = binaryOperators.find((f) => f.name == opTok.type);
							if (!op)
								throw new Error(`Operator ${opTok.type} not implemented.`);

							opFuncs[opTok.type] = op;

							let [lhs, _opGroup, rhs] = syntax.groups.splice(0, 3);
							if (opGroup.source?.[1]?.type === "swap") {
								[lhs, rhs] = [rhs, lhs];
							}

							syntax.groups.unshift({
								type: "binaryOperation",
								groups: [lhs, rhs],
								source: [
									{
										type: "fnName",
										source: [op.name],
										debugInfo: [0, 0]
									}
								]
							});
						} else if (opGroup?.type === "unaryOperator") {
							const opTok = opGroup.source[0];
							const op = unaryOperators.find((f) => f.name == opTok.type);
							if (!op)
								throw new Error(`Operator ${opTok.type} not implemented.`);

							opFuncs[opTok.type] = op;

							let [lhs, _opGroup] = syntax.groups.splice(0, 2);

							syntax.groups.unshift({
								type: "unaryOperation",
								groups: [lhs],
								source: [
									{
										type: "fnName",
										source: [op.name],
										debugInfo: [0, 0]
									}
								]
							});
						} else {
							throw new Error("Undefined operation");
						}
					}
				},

				serialize: (syntax: SerializedGenericSyntax) => {
					syntax.groups = [
						Object.values(opFuncs)
							.map((f) => f.toString())
							.join("\n\n") + "\n\n",

						"console.log(",
						...syntax.groups,
						")"
					];
				}
			},
			binaryOperation: {
				serialize: (syntax) => {
					return `${syntax.source[0].source[0]}(${syntax.groups[0]}, ${syntax.groups[1]})`;
				}
			},
			unaryOperation: {
				serialize: (syntax) => {
					return `${syntax.source[0].source[0]}(${syntax.groups[0]})`;
				}
			}
		},
		$joiner: function (a, ss) {
			return a + ss;
		}
	}
};
