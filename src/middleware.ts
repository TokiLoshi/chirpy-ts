import type { NextFunction, Request, Response } from "express";
import { config } from "./config.js";

type Middleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void>;

export function middlewareLogResponses(
	req: Request,
	res: Response,
	next: NextFunction
) {
	res.on("finish", () => {
		console.log("Middleware running");
		// Grab status code from response object
		const statusCode = res.statusCode;
		const method = req.method;
		const url = req.url;
		console.log(`Status: ${statusCode} method: ${method} url ${url}`);
		// if the status is non-ok log [NON-OK] <http_method> <url> - Status: <status_code>
		if (statusCode >= 300) {
			// replace http_method, url and status code with those properites
			console.log(`[NON-OK] ${method} ${url} - Status: ${statusCode}`);
		} else {
			console.log(`OK`);
		}
	});

	// run server
	// tee the output to server.log
	// gitignore the server log
	next();
}

export function middlewareMetrics(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (req.url === "/app/") {
		config.fileserverHits += 1;
	}

	res.on("finish", () => {
		console.log("Middlware metrics");
	});
	next();
}
