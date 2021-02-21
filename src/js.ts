import Block, { SerializedGenericSyntax } from "q";
import { lexer, parser } from "./parser";
import { unaryOperators } from "./ops";

let opFuncs = "";
let prepend = "";
export default <Block>{
	lex: lexer,
	parse: parser,
	gen: {
		syntaxes: {
			root: {
				serialize: (syntax: SerializedGenericSyntax) => {
					syntax.groups.unshift(opFuncs, prepend);
					console.log(syntax.groups);
				}
			},
			unaryOperator: {
				serialize: (syntax) => {
					const opTok = syntax.source[0];
					const opSrc = opTok.source[0];
					const op = unaryOperators[opSrc];
					if (!op) throw new Error(`Operator ${opSrc} not implemented.`);

					opFuncs += op.toString() + "\n";
					prepend += `${op.name}(`;
					return ")";
				}
			}
		}
	}
};
