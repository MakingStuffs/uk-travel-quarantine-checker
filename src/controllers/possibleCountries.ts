import express, { NextFunction } from "express";
import possibleCountries from "../data/possibleCountries.json";
import { SimpleApiResponse } from "../types/api.types";

const route = express.Router();

route.get(
  "/possible-countries",
  (_req: express.Request, _res: express.Response, next: NextFunction) => {
    if (!!possibleCountries) {
      const response: SimpleApiResponse = {
        data: possibleCountries,
        message: `${possibleCountries.length} countries which may not require quarantine found.`,
        length: possibleCountries.length,
      };
      return _res.json(response).status(200);
    }
  }
);

export { route as possibleCountries };
