import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { asc } from "drizzle-orm";

export async function createChirp(chirp: NewChirp) {
	const [result] = await db.insert(chirps).values(chirp).returning();
	return result;
}

export async function getChirps() {
	const result = await db.query.chirps.findMany({
		orderBy: [asc(chirps.createdAt)],
	});
	return result;
}

export async function deleteChirps() {
	await db.delete(chirps);
}
