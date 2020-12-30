
import { HostRoute } from './route';
import { Router, FoundRoute, RouterMiddwareInput } from '../interface';

interface PrivateStorage {
	routes: HostRoute<any>[];
}

const props: WeakMap<HostRouter<any>, PrivateStorage> = new WeakMap();

export class HostRouter<I extends RouterMiddwareInput> implements Router<HostRoute<I>, I> {
	constructor() {
		props.set(this, {
			routes: [ ]
		});
	}

	createRoute(hostname: string) : HostRoute<I> {
		const { routes } = props.get(this);

		const route = new HostRoute<I>(hostname);

		routes.push(route);

		return route;
	}

	find(hostname: string) : FoundRoute<HostRoute<I>, I> {
		const { routes } = props.get(this);

		for (let i = 0; i < routes.length; i++) {
			const route = routes[i];
			const match = route.matches(hostname);

			if (match) {
				return {
					route,
					params: null,
					glob: null
				};
			}
		}
	}
}
