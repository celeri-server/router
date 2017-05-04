
import { Route } from './route';

const props = new WeakMap();

export class Router {
	constructor() {
		props.set(this, {
			routes: { }
		});
	}

	createRoute(method, route) {
		const { routes } = props.get(this);

		if (! routes[method]) {
			routes[method] = [ ];
		}

		routes[method].push(new Route(method, route));
	}

	find(method, path) {
		const { routes } = props.get(this);

		if (! routes[method]) {
			return;
		}

		for (let i = 0; i < routes.length; i++) {
			const route = routes[i];
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
