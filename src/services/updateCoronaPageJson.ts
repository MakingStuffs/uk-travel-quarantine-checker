import { chromium } from "playwright";
import coronaUrls from "../data/countryPageUrls.json";
import fs from "fs";
import path from "path";
const CORONA_PAGE_FILE = path.resolve(__dirname, "../data/covidPageUrls.json");

export const getCoronaPages = async () => {
  console.log(`Getting COVID 19 info page for ${coronaUrls.length} countries`);
  // Launch chrome
  const browser = await chromium.launch();
  // Country corona page links
  let coronaPageLinks = [...coronaUrls];
  // Iterate country links
  for (let i = 0; i < coronaPageLinks.length; i++) {
    // Get this link
    const link = coronaPageLinks[i];
    // Ensure we dont process needlessly
    if (coronaPageLinks.includes(link)) continue;
    // Get a new page
    let countryPage = await browser.newPage();
    // Visit this link
    await countryPage.goto(link);
    // Check if the page has loaded
    const countryHasLoaded = await countryPage.evaluate(
      () => document.readyState === "complete"
    );
    // If we haven't loaded wait for the load event then use that page
    if (!countryHasLoaded) {
      // Wait for page load event
      [countryPage] = await Promise.all([countryPage.waitForEvent("load")]);
    }
    // Get the corona link
    const coronaLink = await countryPage.evaluate(
      () =>
        (
          document.querySelector(
            '[href*="entry-requirements#entry-rules-in-response-to-coronavirus-covid-19"]'
          ) as HTMLAnchorElement
        )?.href
    );
    // Check we have a link
    if (!!coronaLink) {
      // Push it to the array
      coronaPageLinks.push(coronaLink);
    }
    // close this page
    await countryPage.close();
  }
  console.log("Checking for new data");
  // Check if there are any new corona page links
  if (JSON.stringify(coronaPageLinks) !== JSON.stringify(coronaUrls)) {
    console.log("Writing updated list");
    fs.writeFileSync(
      CORONA_PAGE_FILE,
      JSON.stringify(coronaPageLinks, null, 2)
    );
  }
  // Close the browser
  await browser.close();
};
