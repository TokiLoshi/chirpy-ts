import { eq, sql } from "drizzle-orm";
import { db } from "../index.js";
import { NewUser, users, RefreshToken, refresh_tokens } from "../schema.js";

export async function createUser(user: NewUser) {
	const [result] = await db
		.insert(users)
		.values(user)
		.onConflictDoNothing()
		.returning();
	return result;
}

export async function getUserByEmail(email: string) {
	const [result] = await db.select().from(users).where(eq(users.email, email));
	return result;
}

export async function getUserById(userId: string) {
	const [result] = await db.select().from(users).where(eq(users.id, userId));
}

export async function deleteUsers() {
	await db.delete(users);
}

export async function insertRefreshToken(token: RefreshToken) {
	const [result] = await db.insert(refresh_tokens).values(token).returning();
	return result;
}

export async function getRefreshToken(refreshToken: string) {
	const [result] = await db
		.select()
		.from(refresh_tokens)
		.where(eq(refresh_tokens.token, refreshToken));
	return result;
}

export async function updateToken(refreshToken: string) {
	const [result] = await db
		.update(refresh_tokens)
		.set({ revokedAt: sql`NOW()` })
		.where(eq(refresh_tokens.token, refreshToken));
	return result;
}

export async function updateUser(
	userId: string,
	email: string,
	password: string
) {
	const [result] = await db
		.update(users)
		.set({
			email: email,
			hashedPassword: password,
		})
		.where(eq(users.id, userId))
		.returning();
	return result;
}
