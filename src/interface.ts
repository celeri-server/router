
export interface Match {
	glob: string,
	params: {
		[param: string]: string
	}
}

export interface FoundRoute<T extends Route> {
	route: T,
	params: {
		[param: string]: string
	},
	glob: string
}

export interface Route {
	matches(path: string): Match;
}

export interface Router<T extends Route> {
	createRoute(method: string, path: string): T;
	find(method: string, path: string): FoundRoute<T>;
}
