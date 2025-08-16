import type { Request, Response } from "express";
import { config } from "src/config";

export async function metricsCounter(_: Request, res: Response) {
	res.set("Content-Type", "text/plain; charset=utf-8");
	res.send(`Hits: ${config.fileserverHits}`);
	res.end();
}
