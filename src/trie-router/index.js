
import { TrieRoute } from './route';
import { glob, param, final, BranchParam, FinalParam, getNext, getFinal } from './trie-helpers';

const props = new WeakMap();

export class TrieRouter {
	constructor() {
		props.set(this, {
			routes: { }
		});
	}

	get routes() { return props.get(this).routes; }

	createRoute(method, path) {
		const { routes } = props.get(this);

		if (! routes[method]) {
			routes[method] = { };
		}

		const route = new TrieRoute(method, path);
		const segments = path.split('/').slice(1);

		let paramName;
		let currentBranch = routes[method];
		for (let i = 0; i < segments.length; i++) {
			const segment = segments[i];
			const isFinal = segments.length === i + 1;

			// If this is a glob
			if (segment === '**') {
				if (! isFinal) {
					throw new Error('Glob matchers ** must be the last segment of a route');
				}

				currentBranch[glob] = paramName ? new FinalParam(paramName, route) : route;
			}

			// If this is a param
			else if (segment[0] === ':') {
				if (! currentBranch[param]) {
					currentBranch[param] = { };
				}

				paramName = segment.slice(1);
				currentBranch = currentBranch[param];

				if (isFinal) {
					currentBranch[final] = new FinalParam(paramName, route);
				}
			}

			// Otherwise, treat it as a normal segment
			else {
				if (! currentBranch[segment]) {
					if (paramName) {
						currentBranch[segment] = new BranchParam(paramName, { });
					}
					else {
						currentBranch[segment] = { };
					}
				}
				
				currentBranch = currentBranch[segment];
				if (currentBranch.branch) {
					currentBranch = currentBranch.branch;
				}

				if (isFinal) {
					currentBranch[final] = route;
				}
			}
		}

		return route;
	}

	find(method, path) {
		const { routes } = props.get(this);
		const methodRoutes = routes[method.toLowerCase()];

		if (! methodRoutes) {
			return;
		}

		return findRoute(path.split('/').slice(1), methodRoutes);

	}
}

const findRoute = (segments, branch, paramValue) => {
	const segment = segments[0];
	const remaining = segments.slice(1);

	if (branch[segment]) {
		const { next, paramName } = getNext(branch[segment]);

		if (remaining.length) {
			const found = findRoute(remaining, next);
			
			if (found) {
				const params = paramValue ? { [found.param]: paramValue } : { };
				found.params = Object.assign(found.params || { }, params);

				return found;
			}
		}

		else if (next[final]) {
			const params = paramValue ? { [paramName]: paramValue } : { };

			return {
				route: next[final],
				params: params
			};
		}
	}

	if (branch[param]) {
		const { next, paramName } = getNext(branch[param]);

		if (remaining.length) {
			const found = findRoute(remaining, next, segment);

			if (found) {
				const params = paramValue ? { [paramName]: paramValue } : { };
				found.params = Object.assign(found.params || { }, params);

				return found;
			}
		}

		else if (next[final]) {
			const { route, paramName } = getFinal(next[final]);
			const params = paramName ? { [paramName]: segment } : { };

			return {
				route: route,
				params: params
			};
		}
	}

	if (branch[glob]) {
		const { route, paramName } = getFinal(branch[glob]);
		const params = paramName ? { [paramName]: paramValue } : { };

		return {
			route: route,
			params: params,
			glob: segments.join('/')
		};
	}
};
