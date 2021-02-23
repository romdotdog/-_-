function makeUnaryOperator(
	name: string,
	algorithm: string,
	raw = false
): Function {
	return eval(
		`function ${name}(n){${
			!raw
				? `return Array.isArray(n) ? n.map(${name}) : ${algorithm}`
				: `return ${algorithm}`
		}};${name}`
	);
}

export const unaryOperators = [
	makeUnaryOperator("square", "n ** 2"),
	makeUnaryOperator("cube", "n ** 3"),
	makeUnaryOperator("pow10n", "10 ** n"),
	makeUnaryOperator(
		"factorial",
		"Array.from({length: n - 1}, (x, i) => i + 2).reduce((a, m) => a * m, 1)"
	),
	makeUnaryOperator("x10", "n * 10"),
	makeUnaryOperator("x100", "n * 100"),
	makeUnaryOperator("range", "Array.from({ length: n }, (x, i) => i)"),
	makeUnaryOperator("flatten", "n.flat()", true),

	makeUnaryOperator("sub", "-n"),
	makeUnaryOperator("add", "Math.abs(n)"),
	makeUnaryOperator("g", "n + 1"),
	makeUnaryOperator("l", "n - 1"),
	makeUnaryOperator("sign", "Math.sign(n)"),
	makeUnaryOperator("testExistence", "n !== undefined")
] as Function[];

function makeBinaryOperator(name: string, algorithm: string): Function {
	// TODO: Binary operator behavior
	return eval(`function ${name}(a, b){${`return ${algorithm}`}};${name}`);
}

export const binaryOperators = [
	makeBinaryOperator("add", "a + b"),
	makeBinaryOperator("sub", "a - b"),
	makeBinaryOperator("mul", "a * b"),
	makeBinaryOperator("div", "a / b"),
	makeBinaryOperator("pow", "Math.pow(a, b)"),
	makeBinaryOperator("bsl", "a << b"),
	makeBinaryOperator("bsr", "a >> b"),
	makeBinaryOperator("band", "a & b"),
	makeBinaryOperator("bor", "a | b"),
	makeBinaryOperator("bxor", "a ^ b"),

	makeBinaryOperator("g", "a > b ? 1 : 0"),
	makeBinaryOperator("l", "a < b ? 1 : 0"),
	makeBinaryOperator("e", "a === b ? 1 : 0")
] as Function[];
