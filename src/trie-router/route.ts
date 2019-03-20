
import { RouterMiddwareInput } from '../input';
import { MiddlewarePipeline } from '@celeri/middleware-pipeline';

export class TrieRoute extends MiddlewarePipeline<RouterMiddwareInput> {
	constructor() {
		super();
	}
}
