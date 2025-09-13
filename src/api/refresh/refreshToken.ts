import { getRefreshToken } from "../../db/queries/users.js";
import { makeJWT, makeRefreshToken } from "../../db/auth.js";
import { getBearerToken, validateJWT } from "../../db/auth.js";
import type { Request, Response, NextFunction } from "express";
import { config } from "../../config.js";

export async function generateRefresh(req: Request, res: Response) {
	const refreshToken = getBearerToken(req);

	const user = await getRefreshToken(refreshToken);
	if (!user) {
		return res.status(401).json({ error: "invalid refresh token " });
	}
	const accesssExpirySeconds = 60 * 60;
	const token = makeJWT(user.userId, accesssExpirySeconds, config.secret);
	return res.status(200).json({ token });
}
