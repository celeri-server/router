
import { MiddlewarePipeline } from '@celeri/middleware-pipeline';
import { Route, Match, RouterMiddwareInput } from '../interface';

interface PrivateStorage {
	pattern: RegExp;
}

const props: WeakMap<HostRoute<any>, PrivateStorage> = new WeakMap();

const globPattern = /\*/g;
const globReplacement = '([^\.]+)';

const doubleGlobPattern = /\*\*/g;
const doubleGlobReplacement = '(.+)';

export class HostRoute<I extends RouterMiddwareInput> extends MiddlewarePipeline<I> implements Route<I> {
	/**
	 * @param hostname The hostname pattern (eg. `www.example.com` or  `*.example.com`)
	 */
	constructor(hostname: string) {
		super();

		const pattern = parseHostname(hostname);

		props.set(this, { pattern });
	}

	matches(hostname: string): Match {
		const { pattern } = props.get(this);
		const match = pattern.exec(hostname);

		if (! match) {
			return null;
		}

		return {
			glob: null,
			params: null
		};
	}
}

const parseHostname = (hostname: string) => {
	const pattern: string = hostname
		.replace(doubleGlobPattern, doubleGlobReplacement)
		.replace(globPattern, globReplacement);

	return new RegExp(`^${pattern}$`);
};
