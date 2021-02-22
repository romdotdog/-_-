type Tree<T> = Tree<T>[] | T;

export const unaryOperators = [
	function square(n: Tree<number>): Tree<number> {
		return Array.isArray(n) ? n.map(square) : n ** 2;
	},

	function cube(n: Tree<number>): Tree<number> {
		return Array.isArray(n) ? n.map(cube) : n ** 3;
	},

	function pow10n(n: Tree<number>): Tree<number> {
		return Array.isArray(n) ? n.map(pow10n) : 10 ** n;
	},

	function factorial(n: Tree<number>): Tree<number> {
		if (Array.isArray(n)) return n.map(factorial);
		let rval = 1;
		for (let i = 2; i <= n; i++) rval = rval * i;
		return rval;
	},

	function x10(n: Tree<number>): Tree<number> {
		return Array.isArray(n) ? n.map(x10) : n * 10;
	},

	function x100(n: Tree<number>): Tree<number> {
		return Array.isArray(n) ? n.map(x100) : n * 100;
	},

	function range(n: Tree<number>): number[] {
		if (Array.isArray(n))
			throw new Error("Expected operand for `Σ` to be a number.");
		return Array.from({ length: n }, (x, i) => i);
	}
] as Function[];
