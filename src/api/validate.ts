import type { Request, Response } from "express";

export async function validate(req: Request, res: Response) {
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
			return res.status(400).json({
				error: "Chirp is too long",
			});
		}
	} catch (error) {
		res.status(400).json({
			error: error,
		});
	}
}
