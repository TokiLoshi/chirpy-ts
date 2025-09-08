// import { Request, Response, NextFunction } from "express";
// import { config } from "../../config.js";
// import { deleteUsers } from "../../data/queries/users.js";
// import { ForbiddenError } from "../../middleware.js";
// ts
import { Request, Response, NextFunction } from "express";
import { config } from "../../config.js";
import { deleteUsers } from "../../db/queries/users.js";
import { ForbiddenError } from "../../middleware.js"; // or "../../middleware.js" if that’s the file

export async function resetMetrics(
	_: Request,
	res: Response,
	next: NextFunction
) {
	process.loadEnvFile();
	console.log("Resetting metrics");
	try {
		const platform = process.env["PLATFORM"];
		if (platform !== "dev") {
			throw new ForbiddenError("Forbidden");
		}
		config.api.fileserverHits = 0;
		await deleteUsers();
		res.set("Content-Type", "text/plain; charset=utf-8");
		res.send("OK");
	} catch (error) {
		next(error);
	}
}
