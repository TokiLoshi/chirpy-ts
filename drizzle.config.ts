import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "src/data/schema.ts",
	out: "src/data/out",
	dialect: "postgresql",
	dbCredentials: {
		url: "postgres://biancasilva:@localhost:5432/chirpy?sslmode=disable",
	},
});
