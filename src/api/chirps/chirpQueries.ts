import type { Request, Response, NextFunction } from "express";
import {
	createChirp,
	getChirps,
	getChirpById,
	deleteSingleChirp,
} from "../../db/queries/chirps.js";
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
} from "../../middleware.js";
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
		throw new NotFoundError("couldn't find chirp");
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
		const token = getBearerToken(req);
		const validToken = validateJWT(token, config.secret);

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

			// if (!userId) throw new BadRequestError("user Id is missing");
		} else {
			throw new BadRequestError("Chirp is too long. Max length is 140.");
		}
	} catch (error) {
		next(error);
	}
}

export async function deleteChirp(
	req: Request,
	res: Response,
	next: NextFunction,
	chirpID: string
) {
	// check the token in the header
	const token = getBearerToken(req);
	const userId = validateJWT(token, config.secret);

	if (!userId) {
		throw new BadRequestError("invalid userId");
	}
	console.log("CHirp id: ", chirpID);

	// only owners of the chirp can delete it
	const chirp = await getChirpById(chirpID);
	console.log("Chirp: ", chirp);

	// if chirp is not found return 404
	if (!chirp) {
		throw new NotFoundError("chirp not found");
	}

	// if the user is not the owner of the chirp return 403 NotFoundError
	if (userId !== chirp.userId) {
		throw new ForbiddenError("user does not match");
	}

	// Delete chirp by ID
	await deleteSingleChirp(chirpID);
	// Delete chirp in database
	return res.status(204).send();
	// If chirp is deleted successfully return 204
}
