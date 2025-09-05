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
import { validate } from "./api/validate.js";

const app = express();
const PORT = 8080;
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
	Promise.resolve(resetMetrics(req, res)).catch(next);
});

app.use(express.json());

app.post("/api/validate_chirp", (req, res, next) => {
	Promise.resolve(validate(req, res, next)).catch(next);
});
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
