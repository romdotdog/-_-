import { Lexer, Parser, q } from "q";

// ext: .-_-
// codepage: cp1253 (https://en.wikipedia.org/wiki/Windows-1253)
export const lexer: Lexer = {
	whitespaceRegEx: /\s*/,
	encoding: "win1253",
	tokens: {
		// Literals
		number: /\d+|\d*.\d+/,
		string: /“(.+?)”/,
		char: /‘(.)/,

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

		range: "Σ",
		flatten: "Ξ",

		// Other
		swap: "¬"
	},
	throw: "Unexpected token -_-"
};

export const parser: Parser = {
	root: q`primaryExpression -> (unaryOperator | binaryOperator -> primaryExpression)*`,
	ast: {
		binaryOperator: q`(add | sub | mul | div | pow | bsl | bsr | band | bor) -> (swap)?`,
		primaryExpression: q`parenExpr | half | recurse | number | string | char`,

		parenExpr: q`openingParenthesis -> <expression> -> closingParenthesis`,
		unaryOperator: q`square | cube | pow10n | factorial | x10 | x100 | range | flatten`
	}
};
