import type { Request, Response, NextFunction } from "express";
import { createChirp } from "../../db/queries/chirps.js";
import { BadRequestError } from "../../middleware.js";

export async function newChirp(
	req: Request,
	res: Response,
	next: NextFunction
) {
	res.header("Content-Type", "application/json");
	console.log("Request: ", req.body);
	type responseData = {
		body: string;
	};

	const badWords = ["kerfuffle", "sharbert", "fornax"];

	try {
		// Add validation logic and delete api
		const { body }: responseData = req.body;
		const trimmed = body.trim();
		if (trimmed.length <= 140 && trimmed.length > 0) {
			const splitChirp = trimmed.split(" ");
			const cleanedChirp = [];

			for (const chirp of splitChirp) {
				const lowerChirp = chirp.toLowerCase();

				if (badWords.includes(lowerChirp)) {
					cleanedChirp.push("****");
				} else {
					cleanedChirp.push(chirp);
				}
			}

			const censored = cleanedChirp.join(" ");

			const { userId } = req.body;

			if (!userId) throw new BadRequestError("user Id is missing");

			const newChirp = await createChirp({ userId: userId, body: censored });
			return res.status(201).json({
				id: newChirp.id,
				createdAt: newChirp.createdAt,
				updatedAt: newChirp.updatedAt,
				body: newChirp.body,
				userId: newChirp.userId,
			});
		} else {
			throw new BadRequestError("Chirp is too long. Max length is 140");
		}
	} catch (error) {
		next(error);
	}
}
