
import { RegexRoute } from './route';

const props = new WeakMap();

export class RegexRouter {
	constructor() {
		props.set(this, {
			routes: { }
		});
	}

	createRoute(method, path) {
		const { routes } = props.get(this);

		if (! routes[method]) {
			routes[method] = [ ];
		}

		const route = new RegexRoute(path);
		routes[method].push(route);
		return route;
	}

	find(method, path) {
		const { routes } = props.get(this);
		const methodRoutes = routes[method.toLowerCase()];

		if (! methodRoutes) {
			return;
		}

		for (let i = 0; i < methodRoutes.length; i++) {
			const route = methodRoutes[i];
			const match = route.matches(path);

			if (match) {
				return {
					route,
					params: match.params,
					glob: match.glob
				};
			}
		}
	}
}
