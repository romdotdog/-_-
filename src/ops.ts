function makeUnaryOperator(
	name: string,
	algorithm: string,
	raw = false
): Function {
	return eval(
		`function u_${name}(n){${
			raw
				? `return ${algorithm}`
				: `return Array.isArray(n) ? n.map(${name}) : ${algorithm}`
		}};u_${name}`
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
	makeUnaryOperator("not", "-(n - 1)>>>0"), // >>> 0 turns into unsigned integer
	makeUnaryOperator("testExistence", "n !== undefined ? 1 : 0", true),

	makeUnaryOperator("wrap", "[n]", true),
	makeUnaryOperator("wrapWith", "[[n]]", true),
	makeUnaryOperator("indexFromStart", "n[0]", true),
	makeUnaryOperator("indexFromEnd", "n[n.length - 1]", true),
	makeUnaryOperator("mul", "n.length", true)
] as Function[];

function makeBinaryOperator(
	name: string,
	algorithm: string,
	raw = false
): Function {
	return eval(
		`function b_${name}(a, b){
            ${
							raw
								? `return ${algorithm}`
								: `return Array.isArray(a) ? a.map((e, i) => b_${name}(e, Array.isArray(b) ? b[i % b.length] : b)) : Array.isArray(b) ? console.error("b cannot be an array when a is a scalar. Please swap the operator binary ${name}.") : ${algorithm}`
						}};b_${name}`
	);
}

export const binaryOperators = [
	makeBinaryOperator("add", "a + b"),
	makeBinaryOperator("sub", "a - b"),
	makeBinaryOperator("mul", "a * b"),
	makeBinaryOperator("div", "a / b"),
	makeBinaryOperator("pow", "Math.pow(a, b)"),

	makeBinaryOperator("sl", "a << b"),
	makeBinaryOperator("sr", "a >> b"),
	makeBinaryOperator("and", "a & b"),
	makeBinaryOperator("or", "a | b"),
	makeBinaryOperator("xor", "a ^ b"),

	makeBinaryOperator("g", "a > b ? 1 : 0"),
	makeBinaryOperator("l", "a < b ? 1 : 0"),
	makeBinaryOperator("e", "a === b ? 1 : 0"),

	makeBinaryOperator("concat", "Array.isArray(b) ? [a, ...b] : [a, b]", true),
	makeBinaryOperator("wrapWith", "[a, b]", true),
	makeBinaryOperator("indexFromStart", "a[b]", true),
	makeBinaryOperator("indexFromEnd", "a[a.length - 1 - b]", true)
] as Function[];
