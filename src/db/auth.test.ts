import { describe, it, expect, beforeAll } from "vitest";
import { hashPassword, checkPasswordHash, makeJWT, validateJWT } from "./auth";
import { BadRequestError } from "../middleware";

describe("Password Hashing", () => {
	const password1 = "correctPassword123";
	const password2 = "anotherPassword567";
	let hash1: string;
	let hash2: string;

	beforeAll(async () => {
		hash1 = await hashPassword(password1);
		hash2 = await hashPassword(password2);
	});
	it("should return true for the correct password", async () => {
		const result = await checkPasswordHash(password1, hash1);
		expect(result).toBe(true);
	});
	it("should return true for the correct password", async () => {
		const result = await checkPasswordHash(password2, hash2);
		expect(result).toBe(true);
	});
});

describe("JWT Functions", () => {
	const secret = "secret";
	const wrongSecret = "wrong_secret";
	const userID = "a-unique-user-id";
	let validToken: string;
	beforeAll(async () => {
		validToken = makeJWT(userID, 3600, secret);
	});
	it("should validate a valid token", () => {
		const result = validateJWT(validToken, secret);
		expect(result).toBe(userID);
	});
	it("shoudl throw an error for an invalid user", () => {
		expect(() => validateJWT("invald.token.string", secret)).toThrow(
			BadRequestError
		);
	});
});
