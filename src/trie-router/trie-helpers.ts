
export const glob = Symbol('glob');
export const param = Symbol('param');
export const final = Symbol('final');

export class BranchParam {
	constructor(param, branch) {
		this.param = param;
		this.branch = branch;
	}
}

export class FinalParam {
	constructor(param, route) {
		this.param = param;
		this.route = route;
	}
}

export const getNext = (branch) => {
	if (branch instanceof BranchParam) {
		return {
			next: branch.branch,
			paramName: branch.param
		};
	}

	return { next: branch };
};

export const getFinal = (final) => {
	if (final instanceof FinalParam) {
		return {
			route: final.route,
			paramName: final.param
		};
	}

	return { route: final };
};
