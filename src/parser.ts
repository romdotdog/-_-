import { Lexer, Parser, q } from "q";

// Function declarations
// Ώ lhs: ω rhs: Ω
// Ύ lhs: υ rhs: Υ
// Ί lhs: ι rhs: Ι
// Ή lhs: η rhs: Η
// Έ lhs: ε rhs: Ε
// Ό lhs: ο rhs: Ο

export const fdecs: [string, [string, string, string]][] = Object.entries({
	omega: ["Ώ", "ω", "Ω"],
	upsilon: ["Ύ", "υ", "Υ"],
	iota: ["Ί", "ι", "Ι"],
	eta: ["Ή", "η", "Η"],
	epsilon: ["Έ", "ε", "Ε"],
	omicron: ["Ό", "ο", "Ο"]
});

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
	tau: "τ"
};

const recursion = {
	recurseDepth1: "ς",
	recurseDepth2: "ζ",
	recurseDepth3: "ξ"
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

		...recursion,

		...constants,

		// Other
		swap: "¬",

		// Function declarations
		...fdecs.reduce((acc, x) => {
			acc["decl" + x[0]] = x[1][0];
			return acc;
		}, {} as Record<string, string>),

		// Lhs
		...fdecs.reduce((acc, x) => {
			acc["lhs" + x[0]] = x[1][1];
			return acc;
		}, {} as Record<string, string>),

		// Rhs
		...fdecs.reduce((acc, x) => {
			acc["rhs" + x[0]] = x[1][2];
			return acc;
		}, {} as Record<string, string>)
	},
	throw: "Unexpected token -_-"
};

const joinObjectOr = (n: object) => Object.keys(n).join(" | ");

export const parser: Parser = {
	root: q`expression`,
	ast: {
		expression: q`primaryExpression -> (binaryOperator -> primaryExpression | unaryOperator | recursion | function -> (primaryExpression)?)*`,
		binaryOperator: q`(${joinObjectOr(binaryOperators)}) -> (swap)?`,
		primaryExpression: q`parenExpr | functionParam | constant | literal`,

		constant: q`${joinObjectOr(constants)}`,
		literal: q`number | string | char`,

		functionParam: q`${fdecs
			.map((f) => ["lhs" + f[0], "rhs" + f[0]])
			.flat()
			.join(" | ")}`,

		parenExpr: q`openingParenthesis -> <expression> -> closingParenthesis`,
		unaryOperator: q`${joinObjectOr(unaryOperators)}`,

		function: q`${fdecs
			.map((f) => `<decl${f[0]}> -> <expression> -> (decl${f[0]})?`)
			.join(" | ")}`,

		recursion: q`(${joinObjectOr(recursion)}) -> (primaryExpression)?`
	}
};
