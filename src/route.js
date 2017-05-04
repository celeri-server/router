
import { MiddlewarePipeline } from '@celeri/middleware-pipeline';

const props = new WeakMap();

const paramPattern = /:([^/]+)/g;
const paramReplacement = '([^/]+)';

const globPattern = /\*\*$/;
const globReplacement = '(.+)';

export class Route extends MiddlewarePipeline {
	constructor(method, route) {
		super();

		const { pattern, params } = parseRoute(route);
		props.set(this, { method, route, pattern, params });
	}

	get method() {
		return props.get(this).method;
	}

	get route() {
		return props.get(this).route;
	}

	get params() {
		return props.get(this).params;
	}

	matches(path) {
		const { route, pattern, params } = props.get(this);
		const match = pattern.exec(path);

		if (! match) {
			return null;
		}

		let glob;
		const parsedParams = { };
		match.slice(1).forEach((value, index) => {
			const param = params[index - 1];

			// If this is a final glob match
			if (! param) {
				glob = value;
			}
			else {
				parsedParams[param] = value;
			}
		});

		return {
			glob,
			params: parsedParams
		};
	}
}

const parseRoute = (route) => {
	const params = [ ];
	const pattern = route
		.replace(globPattern, globReplacement)
		.replace(paramPattern, (match, param) => {
			params.push(param);
			return paramReplacement;
		});

	return {
		params: Object.freeze(params), 
		pattern: new RegExp(`^${pattern}$`)
	};
};
