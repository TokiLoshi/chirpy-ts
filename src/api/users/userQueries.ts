import type { Request, Response, NextFunction } from "express";
import { createUser, updateUser } from "../../db/queries/users.js";
import { getBearerToken, hashPassword, validateJWT } from "../../db/auth.js";
import { BadRequestError, UnauthorizedError } from "../../middleware.js";
import { config } from "../../config.js";

export async function newUser(req: Request, res: Response, next: NextFunction) {
	res.header("Content-Type", "application/json");

	try {
		const { email, password } = req.body;
		if (!password || !email) {
			throw new BadRequestError("Email and password are required");
		}

		const hashedPassword = await hashPassword(password);

		const user = await createUser({ email, hashedPassword });
		return res.status(201).json({
			id: user.id,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			email: user.email,
		});
	} catch (error) {
		next(error);
	}
}

export async function editUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	// needs an access token in the header
	try {
		const token = getBearerToken(req);
		const userId = validateJWT(token, config.secret);

		if (!userId) {
			throw new BadRequestError("invalid userId");
		}

		// email and password in request body
		const { email, password } = req.body;
		if (!email || !password) {
			throw new BadRequestError("Email and password are required");
		}
		// Hash the password
		const hashedPassword = await hashPassword(password);

		const updatedUser = await updateUser(userId, email, hashedPassword);
		if (!updatedUser) {
			throw new BadRequestError("Unable to update user");
		}
		return res.status(200).json({
			id: updatedUser.id,
			createdAt: updatedUser.createdAt,
			updatedAt: updatedUser.updatedAt,
			email: updatedUser.email,
		});
	} catch (error) {
		next(error);
	}

	// Update hashed password and email in db
	// if no token send 401
	// if all good send 200 and User without password
}
