import express from "express";
import {
  countryPages,
  coronaPages,
  combinedPages,
  possibleCountries,
} from "./controllers";
import http from "http";
import { data } from "./config";
import { cronJobs } from "./services";

const app = express();

app.get("/", (_req: express.Request, _res: express.Response) => {
  _res.send("Yo");
});

app.use("/api", countryPages);
app.use("/api", coronaPages);
app.use("/api", combinedPages);
app.use("/api", possibleCountries);

const server = http.createServer(app);

server.listen(data.PORT, () => console.log(`Connected on port ${data.PORT}`));

// run our cronjobs
cronJobs();
