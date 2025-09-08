import { Request, Response } from "express";
import { config } from "../../config.js";

export function adminMetrics(_: Request, res: Response) {
	res.set("Content-Type", "text/html; charset=utf-8");
	const count = config.api.fileserverHits;
	res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${count} times!</p>
  </body>
</html>`);
}
