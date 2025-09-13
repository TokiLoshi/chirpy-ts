import { Request, Response } from "express";
import { config } from "../../config.js";
import { getBearerToken } from "../../db/auth.js";
import { getRefreshToken, updateToken } from "../../db/queries/users.js";

export async function revokeToken(req: Request, res: Response) {
	const currentToken = getBearerToken(req);
	console.log("Current Token: ", currentToken);

	const user = await getRefreshToken(currentToken);
	console.log("User: ", user);
	if (!user) {
		console.log("Uh oh spaghetti-o! Boots has fallen");
		return res.status(401).json({ error: "invalid token" });
	}
	await updateToken(currentToken);
	return res.status(204);
}
