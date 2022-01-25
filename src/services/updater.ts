import cron from "node-cron";
import { getCombinedPages } from "./updateCombinedUrlJson";
import { checkQuarantineStatus } from "./checkQuarantineStatus";
import { getCoronaPages } from "./updateCoronaPageJson";
import { getCountryPages } from "./updateCountryPagesJson";
// at 8am everyday
export const cronJobs = () =>
  cron.schedule(
    "*/5 * * * *",
    async () => {
      console.log("Refreshing data");
      try {
        await getCountryPages();
        await getCoronaPages();
        getCombinedPages();
        await checkQuarantineStatus();
      } catch (e) {
        console.log(e);
      }
    },
    {
      scheduled: true,
      timezone: "Europe/London",
    }
  );
