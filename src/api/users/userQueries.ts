import type { Request, Response, NextFunction } from "express";
import { createUser } from "../../db/queries/users.js";

export async function newUser(req: Request, res: Response, next: NextFunction) {
	res.header("Content-Type", "application/json");
	console.log("REquest: ", req.body);

	try {
		const { email } = req.body;
		const user = await createUser(email);
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
