import type { Request, Response } from "express";
import { config } from "../../config.js";

export function metricsCounter(_: Request, res: Response) {
	res.set("Content-Type", "text/plain; charset=utf-8");
	res.send(`Hits: ${config.fileserverHits}`);
}
