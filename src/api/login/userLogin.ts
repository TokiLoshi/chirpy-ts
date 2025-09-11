import type { Request, Response, NextFunction } from "express";
import { checkPasswordHash } from "../../db/auth.js";
import { BadRequestError, UnauthorizedError } from "../../middleware.js";
import { getUserByEmail } from "../../db/queries/users.js";

function makeJWT(userID: string, expiresIn: number, secret: string): string {
	return "";
}

export async function login(req: Request, res: Response, next: NextFunction) {
	res.header("Content-Type", "application/json");
	console.log("Request: ", req.body);

	try {
		// Get email and password from the req
		const { email, password } = req.body;
		if (!password || !email) {
			throw new BadRequestError("email and password are required");
		}

		// Get user from the database
		const user = await getUserByEmail(email);
		// compare the passwords
		const passwordMatch = await checkPasswordHash(
			password,
			user.hashedPassword
		);

		if (!user || !passwordMatch) {
			throw new UnauthorizedError("incorrect email or password");
		}
		return res.status(200).json({
			id: user.id,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			email: user.email,
		});
		// If passwords match retur 20- and copy of user resource (not password)
	} catch (error) {
		next(error);
	}
}
