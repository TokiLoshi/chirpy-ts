import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetrics } from "./middleware.js";
import { metricsCounter } from "./api/metrics/count.js";
import { resetMetrics } from "./api/reset/resetMetrics.js";

const app = express();
const PORT = 8080;
app.use(express.text());

app.use(middlewareLogResponses);
app.use("/app", middlewareMetrics, express.static("./src/app"));
app.get("/api/healthz", handlerReadiness);
app.get("/api/metrics", metricsCounter);
app.get("/api/reset", resetMetrics);

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
