import { Request, Response } from "express";
import { config } from "../config.js";

export function resetMetrics(_: Request, res: Response) {
	console.log("Resetting metrics");
	config.fileserverHits = 0;
	res.set("Content-Type", "text/plain; charset=utf-8");
	res.send("OK");
}
