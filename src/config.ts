import { env } from "node:process";

process.loadEnvFile();
const envData = process.env;

console.log("connection string I hope: ", envData.DB_URL);

type APIConfig = {
	fileserverHits: number;
	dbURL: string;
};

export const config: APIConfig = {
	fileserverHits: 0,
	dbURL: envData.DB_URL || "",
};
