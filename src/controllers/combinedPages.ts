import express, { NextFunction } from "express";
import combinedPages from "../data/combinedPages.json";
import { SimpleApiResponse } from "../types/api.types";

const route = express.Router();

route.get(
  "/combined-pages",
  (_req: express.Request, _res: express.Response, next: NextFunction) => {
    if (!!combinedPages) {
      const response: SimpleApiResponse = {
        data: combinedPages,
        message: `${combinedPages.length} countries with COVID info pages found.`,
        length: combinedPages.length,
      };
      return _res.json(response).status(200);
    }
  }
);

export { route as combinedPages };
