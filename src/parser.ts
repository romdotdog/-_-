import { Lexer, Parser, q } from "q";

const binaryOperators = {
	add: "+",
	sub: "-",

	mul: "*",
	div: "/",

	pow: "•",

	sl: "«", // shift left
	sr: "»", // shift right
	and: "‡",
	or: "†",
	xor: "^",
	not: "~"
};

const unaryOperators = {
	square: "²",
	cube: "³",
	pow10n: "°",
	factorial: "!",

	x10: "%",
	x100: "‰",

	range: "Σ",
	flatten: "Ξ"
};

const constants = {
	half: "½",
	pi: "π",
	tau: "τ",
	recurse: "ƒ"
};

// ext: .-_-
// codepage: cp1253 (https://en.wikipedia.org/wiki/Windows-1253)
export const lexer: Lexer = {
	whitespaceRegEx: /\s*/,
	encoding: "win1253",
	tokens: {
		// Literals
		number: /\d+|\d*\.\d+/,
		string: /“(.+?)”/,
		char: /‘(.)/,

		openingParenthesis: "[",
		closingParenthesis: "]",

		...binaryOperators,

		...unaryOperators,

		...constants,

		// Other
		swap: "¬"
	},
	throw: "Unexpected token -_-"
};

export const parser: Parser = {
	root: q`expression`,
	ast: {
		expression: q`primaryExpression -> (unaryOperator | binaryOperator -> primaryExpression)*`,
		binaryOperator: q`(${Object.keys(binaryOperators).join(" | ")}) -> (swap)?`,
		primaryExpression: q`parenExpr | ${Object.keys(constants).join(
			" | "
		)} | number | string | char`,

		parenExpr: q`openingParenthesis -> <expression> -> closingParenthesis`,
		unaryOperator: q`${Object.keys(unaryOperators).join(" | ")}`
	}
};
