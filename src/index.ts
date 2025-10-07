import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import {
	middlewareLogResponses,
	middlewareMetrics,
	errorHandler,
} from "./middleware.js";
import { metricsCounter } from "./api/metrics/count.js";
import { resetMetrics } from "./admin/reset/resetMetrics.js";
import { adminMetrics } from "./admin/metrics/adminMetrics.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { editUser, newUser } from "./api/users/userQueries.js";
import {
	newChirp,
	getAllChirps,
	getSingleChirp,
	deleteChirp,
} from "./api/chirps/chirpQueries.js";
import { login } from "./api/login/userLogin.js";
import { generateRefresh } from "./api/refresh/refreshToken.js";
import { revokeToken } from "./api/revoke/revokeToken.js";
import { polkaUpdate } from "./api/polka/upgradeUser.js";

type polkaHook = {
	event: string;
	data: {
		userId: string;
	};
};

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
app.use(express.text());

app.use(middlewareLogResponses);
app.use("/app", middlewareMetrics, express.static("./src/app"));

app.get("/api/healthz", (req, res, next) => {
	Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.get("/api/metrics", (req, res, next) => {
	Promise.resolve(metricsCounter(req, res)).catch(next);
});
app.get("/admin/metrics", (req, res, next) => {
	Promise.resolve(adminMetrics(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
	Promise.resolve(resetMetrics(req, res, next)).catch(next);
});

app.use(express.json());
app.post("/api/users", (req, res, next) => {
	Promise.resolve(newUser(req, res, next)).catch(next);
});
app.put("/api/users", (req, res, next) => {
	Promise.resolve(editUser(req, res, next)).catch(next);
});
app.post("/api/login", (req, res, next) => {
	Promise.resolve(login(req, res, next)).catch(next);
});

app.get("/api/chirps", (req, res, next) => {
	Promise.resolve(getAllChirps(req, res)).catch(next);
});
app.get("/api/chirps/:id", (req, res, next) => {
	const id = req.params.id;
	Promise.resolve(getSingleChirp(req, res, next, id)).catch(next);
});
app.post("/api/chirps", (req, res, next) => {
	Promise.resolve(newChirp(req, res, next)).catch(next);
});
app.delete("/api/chirps/:chirpID", (req, res, next) => {
	const id = req.params.chirpID;
	Promise.resolve(deleteChirp(req, res, next, id)).catch(next);
});
app.post("/api/refresh", (req, res, next) => {
	Promise.resolve(generateRefresh(req, res)).catch(next);
});
app.post("/api/revoke", (req, res, next) => {
	Promise.resolve(revokeToken(req, res)).catch(next);
});
app.post("/api/polka/webhooks", (req, res, next) => {
	Promise.resolve(polkaUpdate(req, res, next)).catch(next);
});

app.use(errorHandler);

app.listen(config.api.port, () => {
	console.log(`Server is running at http://localhost:${config.api.port}`);
});
