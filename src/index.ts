import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetrics } from "./middleware.js";
import { metricsCounter } from "./metrics/count.js";
import { resetMetrics } from "./reset/resetMetrics.js";

const app = express();
const PORT = 8080;
app.use(express.text());

app.use(middlewareMetrics);

app.use(middlewareLogResponses);
app.use("/app", express.static("./src/app"));
app.get("/healthz", handlerReadiness);
app.get("/metrics", metricsCounter);
app.get("/reset", resetMetrics);

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
