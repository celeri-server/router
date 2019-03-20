
import { RouterMiddwareInput } from '../input';
import { MiddlewarePipeline } from '@celeri/middleware-pipeline';

interface PrivateStorage {
	pattern: RegExp,
	params: ReadonlyArray<string>
}

interface Match {
	glob: string,
	params: {
		[param: string]: string
	}
}

const props: WeakMap<RegexRoute, PrivateStorage> = new WeakMap();

const paramPattern = /:([^/]+)/g;
const paramReplacement = '([^/]+)';

const globPattern = /\*\*$/;
const globReplacement = '(.+)';

export class RegexRoute extends MiddlewarePipeline<RouterMiddwareInput> {
	/**
	 * @param route The route pattern (eg. `/people/:personId`)
	 */
	constructor(route: string) {
		super();

		const { pattern, params } = parseRoute(route);

		props.set(this, { pattern, params });
	}

	matches(path: string): Match {
		const { pattern, params } = props.get(this);
		const match = pattern.exec(path);

		if (! match) {
			return null;
		}

		let glob: string;
		const parsedParams = { };

		match.slice(1).forEach((value, index) => {
			const param = params[index];

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

const parseRoute = (route: string) => {
	const params: string[] = [ ];
	const pattern: string = route
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