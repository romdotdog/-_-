import { Lexer, Parser, q } from "q";

// ext: .-_-
// codepage: cp1253
export const lexer: Lexer = {
	whitespaceRegEx: /\s*/,
	tokens: {
		// Literals
		number: /\d+|\d*.\d+/,
		string: /“(.+?)”/u,
		char: /‘(.)/u,

		openingParenthesis: "[",
		closingParenthesis: "]",

		// Constants
		half: "½",
		recurse: "ƒ",

		// Ops

		// Binary
		add: "+",
		sub: "-",

		mul: "*",
		div: "/",

		pow: "^",

		bsl: "«", // shift left
		bsr: "»", // shift right
		band: "‡", // bitwise and
		bor: "†", // bitwise or

		// Unary
		square: "²",
		cube: "³",
		pow10n: "°",
		factorial: "!",

		x10: "%",
		x100: "‰",

		swap: "¬",
		range: "Σ"
	},
	throw: "Unexpected token -_-"
};

export const parser: Parser = {
	root: q`expression`,
	ast: {
		expression: q`primaryExpression -> (unaryOperator | binaryOperator -> (expression | primaryExpression))?`,
		binaryOperator: q`(add | sub | mul | div | pow | bsl | bsr | band | bor) -> (swap)?`,
		primaryExpression: q`parenExpr | number`,

		parenExpr: q`openingParenthesis -> <expression> -> closingParenthesis`,
		unaryOperator: q`square | cube | pow10n | factorial | x10 | x100 | range`
	}
};
