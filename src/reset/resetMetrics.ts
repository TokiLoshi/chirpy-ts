import { Request, Response } from "express";
import { config } from "src/config";

export async function resetMetrics(_: Request, res: Response) {
	config.fileserverHits = 0;
}
