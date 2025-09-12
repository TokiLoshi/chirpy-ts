import type { Request, Response, NextFunction } from "express";
import { checkPasswordHash, makeJWT } from "../../db/auth.js";
import { BadRequestError, UnauthorizedError } from "../../middleware.js";
import { getUserByEmail } from "../../db/queries/users.js";
import { config } from "../../config.js";

export async function login(req: Request, res: Response, next: NextFunction) {
	res.header("Content-Type", "application/json");

	try {
		// Get email and password from the req
		const { email, password } = req.body;

		if (!password || !email) {
			throw new BadRequestError("email and password are required");
		}

		// Get user from the database
		const user = await getUserByEmail(email);
		if (!user) {
			throw new UnauthorizedError("no user");
		}
		// compare the passwords
		const passwordMatch = await checkPasswordHash(
			password,
			user.hashedPassword
		);

		if (!passwordMatch) {
			throw new UnauthorizedError("incorrect email or password");
		}
		const expires = req.body.expiresInSeconds;
		let expiry = expires;
		if ((!expiry || expiry > 3600) && expiry !== 0) {
			expiry = 3600;
		}
		const token = makeJWT(user.id, expiry, config.secret);
		return res.status(200).json({
			id: user.id,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			email: user.email,
			token: token,
		});
		// If passwords match retur 20- and copy of user resource (not password)
	} catch (error) {
		next(error);
	}
}
