import { NextFunction, Request, Response } from "express";
import { upgradeUser } from "../../db/queries/users.js";
import { NotFoundError, UnauthorizedError } from "../../middleware.js";
import { config } from "../../config.js";
import { getAPIKey } from "../../db/auth.js";

export async function polkaUpdate(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { event, data } = req.body;
	const apikey = getAPIKey(req);
	if (config.polkaKey !== apikey) {
		throw new UnauthorizedError("incorrect api key");
	}
	if (event !== "user.upgraded") {
		return res.sendStatus(204);
	}

	const userId = data.userId;
	if (!userId) {
		return res.sendStatus(204);
	}
	const upgradedUser = await upgradeUser(userId);
	if (!upgradedUser) {
		throw new NotFoundError("user could not be found");
	}
	return res.sendStatus(204);
}
