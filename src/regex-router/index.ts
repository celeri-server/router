
import { RegexRoute } from './route';
import { Router, FoundRoute, RouterMiddwareInput } from '../interface';

interface PrivateStorage {
	routes: {
		[method: string]: RegexRoute<any>[]
	}
}

const props: WeakMap<RegexRouter<any>, PrivateStorage> = new WeakMap();

export class RegexRouter<I extends RouterMiddwareInput> implements Router<RegexRoute<I>, I> {
	constructor() {
		props.set(this, {
			routes: { }
		});
	}

	createRoute(method: string, path: string) : RegexRoute<I> {
		const { routes } = props.get(this);

		if (! routes[method]) {
			routes[method] = [ ];
		}

		const route = new RegexRoute(path) as RegexRoute<I>;

		routes[method].push(route);

		return route;
	}

	find(method: string, path: string) : FoundRoute<RegexRoute<I>, I> {
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
