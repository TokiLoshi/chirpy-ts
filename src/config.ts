import type { MigrationConfig } from "drizzle-orm/migrator";

type Config = {
	api: APIConfig;
	db: DBConfig;
	secret: string;
};

type APIConfig = {
	fileserverHits: number;
	port: number;
};

type DBConfig = {
	url: string;
	migrationConfig: MigrationConfig;
};

process.loadEnvFile();

function envOrThrow(key: string) {
	const envData = process.env[key];
	if (!envData) {
		throw new Error(`Environment variables missing`);
	}
	return envData;
}

const migrationConfig: MigrationConfig = {
	migrationsFolder: "./src/db/out",
};

export const config: Config = {
	api: {
		fileserverHits: 0,
		port: Number(envOrThrow("PORT")),
	},
	db: {
		url: envOrThrow("DB_URL"),
		migrationConfig,
	},
	secret: envOrThrow("SECRET").trim(),
};
