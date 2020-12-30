
import { MiddlewarePipeline } from '@celeri/middleware-pipeline';
import { IncomingMessage, ServerResponse } from 'http';

export interface RouterMiddwareInput {
	req: IncomingMessage,
	res: ServerResponse
}

export interface Match {
	glob: string,
	params: {
		[param: string]: string
	}
}

export interface FoundRoute<T extends Route<I>, I extends RouterMiddwareInput> {
	route: T,
	params: {
		[param: string]: string
	},
	glob: string
}

export interface Route<I extends RouterMiddwareInput> extends MiddlewarePipeline<I> {
	matches(path: string): Match;
}

export interface Router<T extends Route<I>, I extends RouterMiddwareInput> {
	createRoute(method: string, path: string): T;
	// TODO: Modify this to also take headers['host'] to enable creating HostRouter
	find(method: string, path: string): FoundRoute<T, I>;
}
