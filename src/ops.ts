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
	makeUnaryOperator("flatten", "n.flat()", true)
] as Function[];

function makeBinaryOperator(name: string, algorithm: string): Function {
	// TODO: Binary operator behavior
	return eval(`function ${name}(a, b){${`return ${algorithm}`}};${name}`);
}

export const binaryOperators = [
	makeBinaryOperator("add", "a + b")
] as Function[];
