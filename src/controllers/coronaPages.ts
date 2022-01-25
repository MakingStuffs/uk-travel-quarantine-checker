import express, { NextFunction } from "express";
import coronaPages from "../data/covidPageUrls.json";
import { SimpleApiResponse } from "../types/api.types";

const route = express.Router();

route.get(
  "/covid-pages",
  (_req: express.Request, _res: express.Response, next: NextFunction) => {
    if (!!coronaPages) {
      const response: SimpleApiResponse = {
        data: coronaPages,
        message: `${coronaPages.length} COVID-19 advice pages found.`,
        length: coronaPages.length,
      };
      return _res.json(response).status(200);
    }
  }
);

export { route as coronaPages };
