import type { Request, Response } from "express";

export async function validate(req: Request, res: Response) {
	type responseData = {
		body: string;
	};
	res.header("Content-Type", "application/json");
	console.log("Request: ", req.body);
	if (req)
		try {
			// chirps should only be 140 characters
			const { body }: responseData = req.body;

			if (body.length <= 140) {
				return res.status(200).json({ valid: true });
			} else {
				return res.status(400).json({
					error: "Chirp is too long",
				});
			}
		} catch (error) {
			// if any errors respond with HTTP status code and json body: { "error" : "something went wrong message" }
			res.status(400).json({
				error: error,
			});
		}
}
