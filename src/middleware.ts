import type { NextFunction, Request, Response } from "express";
import { config } from "./config.js";

export function errorHandler(
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) {
	console.error("Uhoh, spaghetti-o, boots has fallen");
	res.status(500).json({
		error: "Something went wrong on our end",
	});
	// handle errors in try catch
	// for long
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
	// if (req.url === "/app/") {
	// 	config.fileserverHits += 1;
	// }
	console.log(`Getting midleware metrics: ${config.fileserverHits}`);
	config.fileserverHits++;
	// res.on("finish", () => {
	// 	console.log("Middlware metrics");
	// });
	next();
}
