import type { NextFunction, Request, Response } from "express";
import { config } from "./config.js";

export class BadRequestError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export class UnauthorizedError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export class ForbiddenError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export function errorHandler(
	err: Error,
	_: Request,
	res: Response,
	__: NextFunction
) {
	console.error("Uhoh, spaghetti-o, boots has fallen");
	if (err instanceof BadRequestError) {
		res.status(400).send({ error: err.message });
	} else if (err instanceof UnauthorizedError) {
		res.status(401).send({ error: err.message });
	} else if (err instanceof ForbiddenError) {
		res.status(403).send({ error: err.message });
	} else if (err instanceof NotFoundError) {
		res.status(404).send({ error: err.message });
	} else {
		res.status(500).json({
			error: "Internal Server Error",
		});
	}
}

export function middlewareLogResponses(
	req: Request,
	res: Response,
	next: NextFunction
) {
	res.on("finish", () => {
		const statusCode = res.statusCode;
		const method = req.method;
		const url = req.url;
		console.log(`Status: ${statusCode} method: ${method} url ${url}`);
		if (statusCode >= 300) {
			console.log(`[NON-OK] ${method} ${url} - Status: ${statusCode}`);
		} else {
			console.log(`OK`);
		}
	});
	next();
}

export function middlewareMetrics(
	_: Request,
	__: Response,
	next: NextFunction
) {
	console.log(`Getting midleware metrics: ${config.api.fileserverHits}`);
	config.api.fileserverHits++;

	next();
}
