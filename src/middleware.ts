import type { NextFunction, Request, Response } from "express";
import { config } from "./config";

type Middleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void>;

export const middlewareLogResponses: Middleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.on("finish", () => {
		console.log("Middleware");
		// Grab status code from response object
		const statusCode = res.statusCode;
		const method = req.method;
		const url = req.url;
		// if the status is non-ok log [NON-OK] <http_method> <url> - Status: <status_code>
		if (statusCode < 200 || statusCode >= 300) {
			// replace http_method, url and status code with those properites
			console.log(`[NON-OK] ${method} ${url} - Status: ${statusCode}`);
		}
	});

	// run server
	// tee the output to server.log
	// gitignore the server log
	next();
};

export const middlewareMetrics: Middleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.on("finish", () => {
		console.log("Middlware metrics");
		config.fileserverHits += 1;
	});
	next();
};
