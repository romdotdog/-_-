import Block, { SerializedGenericSyntax } from "q";
import { lexer, parser, fdecs } from "./parser";
import { binaryOperators, unaryOperators } from "./ops";

const constants = {
	half: ".5",
	pi: "Math.pi",
	tau: "Math.pi*2"
};

let currentFunction = ["main"]; // Scope order

let opFuncs: Record<string, Function> = {};
export default <Block>{
	lex: lexer,
	parse: parser,
	gen: {
		syntaxes: {
			expression: {
				visit: (syntax) => {
					while (syntax.groups.length != 1) {
						const opSyntax = syntax.groups[1];
						console.log(opSyntax);

						// TODO: switch statement
						if (opSyntax?.type === "binaryOperator") {
							const opTok = opSyntax.source[0];
							const op = binaryOperators.find((f) => f.name == opTok.type);
							if (!op)
								throw new Error(`Operator ${opTok.type} not implemented.`);

							opFuncs[opTok.type] = op;

							let [lhs, _opSyntax, rhs] = syntax.groups.splice(0, 3);
							if (opSyntax.source?.[1]?.type === "swap") {
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
						} else if (opSyntax?.type === "unaryOperator") {
							const opTok = opSyntax.source[0];
							const op = unaryOperators.find((f) => f.name == opTok.type);
							if (!op)
								throw new Error(`Operator ${opTok.type} not implemented.`);

							opFuncs[opTok.type] = op;

							let [lhs, _opSyntax] = syntax.groups.splice(0, 2);

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
						} else if (opSyntax?.type === "function") {
							let [lhs, _opSyntax, rhs] = syntax.groups.splice(0, 3);
							const [fName, functionExpr] = opSyntax.groups;

							if (rhs?.type === "primaryExpression") {
								// Binary
								syntax.groups.unshift({
									type: "customBinaryOperation",
									groups: [fName, functionExpr, lhs, rhs],
									source: []
								});
							} else {
								// Unary
								syntax.groups.unshift(
									{
										type: "customUnaryOperation",
										groups: [fName, functionExpr, lhs],
										source: []
									},
									...(rhs ? [rhs] : [])
								);
							}
						} else if (opSyntax?.type === "recursion") {
							let [lhs, _opSyntax, rhs] = syntax.groups.splice(0, 3);
							const [recursionTok] = opSyntax.source;

							console.log([opSyntax, opSyntax.groups, opSyntax.source]);
							if (rhs?.type === "primaryExpression") {
								// Binary
								syntax.groups.unshift({
									type: "recursionBinaryOperation",
									groups: [lhs, rhs],
									source: [recursionTok]
								});
							} else {
								// Unary
								syntax.groups.unshift(
									{
										type: "recursionUnaryOperation",
										groups: [lhs],
										source: [recursionTok]
									},
									...(rhs ? [rhs] : [])
								);
							}
						} else {
							throw new Error(
								`Couldn't generate code for operator with type \`${opSyntax?.type}\``
							);
						}
					}
				}
			},
			root: {
				serialize: (syntax: SerializedGenericSyntax) => {
					syntax.groups = [
						Object.values(opFuncs)
							.map((f) => f.toString())
							.join("\n\n") + "\n\n",

						`console.log((function ${currentFunction.pop()}() { return `,
						...syntax.groups,
						"})())"
					];
				}
			},
			binaryOperation: {
				serialize: (syntax) => {
					const [lhs, rhs] = syntax.groups;
					return `${syntax.source[0].source[0]}(${lhs}, ${rhs})`;
				}
			},
			unaryOperation: {
				serialize: (syntax) => {
					const [lhs] = syntax.groups;
					return `${syntax.source[0].source[0]}(${lhs})`;
				}
			},
			recursionBinaryOperation: {
				serialize: (syntax) => {
					const [lhs, rhs] = syntax.groups;

					const fn = fdecs.find((f) => f[1][1] === syntax.source[0].type);
					if (fn === undefined)
						throw new Error("Recursion depth not recognized.");

					return `${fn[1][0]}(${lhs}, ${rhs})`;
				}
			},
			recursionUnaryOperation: {
				serialize: (syntax) => {
					const [lhs] = syntax.groups;

					const fn = fdecs.find((f) => f[1][1] === syntax.source[0].type);
					if (fn === undefined)
						throw new Error("Recursion depth not recognized.");

					return `${fn[1][0]}(${lhs})`;
				}
			},
			customBinaryOperation: {
				visit: (syntax) => {
					const [fName] = syntax.groups;
					currentFunction.push(fName.source[0].source[0]);
				},
				serialize: (syntax) => {
					const [, functionExpr, lhs, rhs] = syntax.groups;
					const fName = currentFunction.pop();

					const [, fdec] = fdecs.find((f) => f[1][0] == fName)!;
					const decLhs = fdec[1],
						decRhs = fdec[2];

					return `(function ${fName}(${decLhs}, ${decRhs}) {return ${functionExpr}})(${lhs}, ${rhs})`;
				}
			},
			customUnaryOperation: {
				visit: (syntax) => {
					const [fName] = syntax.groups;
					currentFunction.push(fName.source[0].source[0]);
				},
				serialize: (syntax) => {
					const [, functionExpr, lhs] = syntax.groups;
					const fName = currentFunction.pop();

					const [, fdec] = fdecs.find((f) => f[1][0] == fName)!;
					const decLhs = fdec[1],
						decRhs = fdec[2];

					return `(function ${fName}(${decLhs}, ${decRhs}) {return ${functionExpr}})(${lhs})`;
				}
			}
		},
		$joiner: function (a, ss) {
			return a + ss;
		}
	}
};
