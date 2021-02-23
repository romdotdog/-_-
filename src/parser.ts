import { Lexer, Parser, q } from "q";

export const fdecs: [
	string,
	[marker: string, recurse: string, lhs: string, rhs: string]
][] = Object.entries({
	omega: ["Ω", "Ώ", "ω", "ώ"],
	upsilon: ["Υ", "Ύ", "υ", "ύ"],
	iota: ["Ι", "Ί", "ι", "ί"],
	eta: ["Η", "Ή", "η", "ή"],
	epsilon: ["Ε", "Έ", "ε", "έ"],
	omicron: ["Ο", "Ό", "ο", "ό"]
});

const binaryOperators = {
	add: "+",
	sub: "-",

	mul: "*",
	div: "/",

	pow: "•",

	sl: "«", // shift left
	sr: "»", // shift right
	and: "&",
	or: "|",
	xor: "^",
	not: "~",

	g: ">",
	l: "<",
	e: "="
};

const unaryOperators = {
	square: "²",
	cube: "³",
	pow10n: "°",
	factorial: "!",

	x10: "%",
	x100: "‰",

	range: "Σ",
	flatten: "Ξ",

	sub: "-",
	add: "+",
	g: ">",
	l: "<",
	sign: "±",
	testExistence: "?"
};

const constants = {
	half: "½",
	pi: "π",
	tau: "τ"
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

		openingParenthesis: "(",
		closingParenthesis: ")",

		...binaryOperators,

		...unaryOperators,

		...constants,

		// Other
		swap: "¬",
		if: "—",
		else: "…",

		// Function declarations
		...fdecs.reduce((acc, x) => {
			acc["decl" + x[0]] = x[1][0];
			return acc;
		}, {} as Record<string, string>),

		// Recursion
		...fdecs.reduce((acc, x) => {
			acc["recurse" + x[0]] = x[1][1];
			return acc;
		}, {} as Record<string, string>),

		// Lhs
		...fdecs.reduce((acc, x) => {
			acc["lhs" + x[0]] = x[1][2];
			return acc;
		}, {} as Record<string, string>),

		// Rhs
		...fdecs.reduce((acc, x) => {
			acc["rhs" + x[0]] = x[1][3];
			return acc;
		}, {} as Record<string, string>)
	},
	throw: "Unexpected token -_-"
};

const joinObjectOr = (n: object) => Object.keys(n).join(" | ");

export const parser: Parser = {
	root: q`expression`,
	ast: {
		expression: q`primaryExpression -> (binaryOperator -> primaryExpression | unaryOperator | recursion | function -> (primaryExpression)? | ifExpr)*`,
		binaryOperator: q`(${joinObjectOr(binaryOperators)}) -> (swap)?`,
		primaryExpression: q`parenExpr | functionParam | constant | literal`,

		constant: q`${joinObjectOr(constants)}`,
		literal: q`number | string | char`,

		functionParam: q`${fdecs
			.map((f) => ["lhs" + f[0], "rhs" + f[0]])
			.flat()
			.join(" | ")}`,

		parenExpr: q`openingParenthesis -> expression -> closingParenthesis`,
		unaryOperator: q`${joinObjectOr(unaryOperators)}`,

		function: q`${fdecs
			.map((f) => `<decl${f[0]}> -> expression -> (decl${f[0]})?`)
			.join(" | ")}`,

		recursion: q`(${fdecs
			.map((f) => "recurse" + f[0])
			.join(" | ")}) -> (primaryExpression)?`,

		ifExpr: q`if -> expression -> else -> expression`
	}
};
