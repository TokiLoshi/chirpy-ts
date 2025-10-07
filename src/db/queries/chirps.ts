import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { asc, desc, eq } from "drizzle-orm";

export async function createChirp(chirp: NewChirp) {
	const [result] = await db.insert(chirps).values(chirp).returning();
	return result;
}

export async function getChirps(sortValue: string = "asc") {
	const result = await db.query.chirps.findMany({
		orderBy: [
			sortValue === "desc" ? desc(chirps.createdAt) : asc(chirps.createdAt),
		],
	});
	return result;
}

export async function getChirpById(id: string) {
	const [result] = await db.select().from(chirps).where(eq(chirps.id, id));
	return result;
}

export async function getChirpsByAuthor(userId: string) {
	const results = await db
		.select()
		.from(chirps)
		.where(eq(chirps.userId, userId));
	return results;
}

export async function deleteChirps() {
	await db.delete(chirps);
}

export async function deleteSingleChirp(chirpId: string) {
	await db.delete(chirps).where(eq(chirps.id, chirpId));
}
