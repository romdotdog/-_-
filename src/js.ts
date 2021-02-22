import Block, { SerializedGenericSyntax } from "q";
import { lexer, parser } from "./parser";
import { unaryOperators } from "./ops";

let opFuncs: Record<string, Function> = {};
let prepend = "";
export default <Block>{
	lex: lexer,
	parse: parser,
	gen: {
		syntaxes: {
			root: {
				serialize: (syntax: SerializedGenericSyntax) => {
					syntax.groups.unshift(
						Object.values(opFuncs)
							.map((f) => f.toString())
							.join("\n\n") + "\n\n",
						prepend
					);
				}
			},
			unaryOperator: {
				serialize: (syntax) => {
					const opTok = syntax.source[0];
					const op = unaryOperators.find((f) => f.name == opTok.type);
					if (!op) throw new Error(`Operator ${opTok.type} not implemented.`);

					opFuncs[opTok.type] = op;
					prepend += `${op.name}(`;
					return ")";
				}
			}
		}
	}
};
