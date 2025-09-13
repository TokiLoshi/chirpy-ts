import type { Request, Response, NextFunction } from "express";
import {
	createChirp,
	getChirps,
	getChirpById,
} from "../../db/queries/chirps.js";
import { BadRequestError } from "../../middleware.js";
import { getBearerToken, validateJWT } from "../../db/auth.js";
import { config } from "../../config.js";

export async function getAllChirps(res: Response) {
	const chirps = await getChirps();
	return res.status(200).json(chirps);
}

export async function getSingleChirp(
	req: Request,
	res: Response,
	next: NextFunction,
	chirpId: string
) {
	// return a single chirp
	res.header("Content-Type", "application/json");
	try {
		const chirp = await getChirpById(chirpId);
		if (chirp) {
			return res.status(200).json(chirp);
		}
		throw new BadRequestError("couldn't find chirp");
	} catch (error) {
		next(error);
	}
}

export async function newChirp(
	req: Request,
	res: Response,
	next: NextFunction
) {
	res.header("Content-Type", "application/json");
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

			// const { userId } = req.body;

			let token;
			let validToken;
			try {
				token = getBearerToken(req);

				validToken = validateJWT(token, config.secret);
				const newChirp = await createChirp({
					userId: validToken,
					body: censored,
				});
				return res.status(201).json({
					id: newChirp.id,
					createdAt: newChirp.createdAt,
					updatedAt: newChirp.updatedAt,
					body: newChirp.body,
					userId: validToken,
				});
			} catch (error) {
				console.log("Error with token in chirps", error);
				throw new BadRequestError("invalid jwt");
			}

			// if (!userId) throw new BadRequestError("user Id is missing");
		} else {
			throw new BadRequestError("Chirp is too long. Max length is 140");
		}
	} catch (error) {
		next(error);
	}
}
