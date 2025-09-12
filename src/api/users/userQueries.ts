import type { Request, Response, NextFunction } from "express";
import { createUser } from "../../db/queries/users.js";
import { hashPassword } from "../../db/auth.js";
import { BadRequestError } from "../../middleware.js";

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
