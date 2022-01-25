import express, { NextFunction } from "express";
import countryPages from "../data/countryPageUrls.json";
import { SimpleApiResponse } from "../types/api.types";

const route = express.Router();

route.get(
  "/country-pages",
  (_req: express.Request, _res: express.Response, next: NextFunction) => {
    if (!!countryPages) {
      const response: SimpleApiResponse = {
        data: countryPages,
        message: `${countryPages.length} countries found.`,
        length: countryPages.length,
      };
      return _res.json(response).status(200);
    }
  }
);

export { route as countryPages };
