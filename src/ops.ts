type Tree<T> = Tree<T>[] | T;

export const unaryOperators = [
	function pow10n(n: Tree<number>): Tree<number> {
		return Array.isArray(n) ? n.map(pow10n) : 10 ** n;
	}
] as Function[];
