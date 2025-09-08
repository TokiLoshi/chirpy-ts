import type { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../middleware.js";

export async function validate(
	req: Request,
	res: Response,
	next: NextFunction
) {
	type responseData = {
		body: string;
	};

	const badWords = ["kerfuffle", "sharbert", "fornax"];

	res.header("Content-Type", "application/json");
	console.log("Request: ", req.body);
	try {
		// chirps should only be 140 characters
		const { body }: responseData = req.body;

		if (body.length <= 140) {
			const splitChirp = body.split(" ");
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

			return res.status(200).json({ cleanedBody: censored });
		} else {
			throw new BadRequestError("Chirp is too long. Max length is 140");
		}
	} catch (error) {
		next(error);
	}
}
