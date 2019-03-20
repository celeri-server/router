
import { IncomingMessage, ServerResponse } from 'http';

export interface RouterMiddwareInput {
	req: IncomingMessage,
	res: ServerResponse
}
