import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { BadRequestError } from "../middleware";

export async function hashPassword(password: string): Promise<string> {
	const hashedPassword = await bcrypt.hash(password, 10);
	return hashedPassword;
}

export async function checkPasswordHash(
	password: string,
	hash: string
): Promise<boolean> {
	const passwordMatch = await bcrypt.compare(password, hash);
	return passwordMatch;
}

export function makeJWT(
	userID: string,
	expiresIn: number,
	secret: string
): string {
	type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;
	const issuer = "chirpy";
	const userId = userID;
	const currentTime = Math.floor(Date.now() / 1000);
	const expiry = currentTime + expiresIn;
	const payload: payload = {
		iss: issuer,
		sub: userId,
		iat: currentTime,
		exp: expiry,
	};
	const token = jwt.sign(payload, secret, { algorithm: "HS256" });
	return token;
}

export function validateJWT(tokenString: string, secret: string): string {
	try {
		const decoded = jwt.verify(tokenString, secret) as JwtPayload;
		if (!decoded.sub || !decoded.iss) {
			throw new BadRequestError("user id not found");
		}

		const userId = decoded.sub;
		return userId;
	} catch (error) {
		throw new BadRequestError("jwt is invalid");
	}
}
