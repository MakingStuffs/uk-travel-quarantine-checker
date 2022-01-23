const { chromium } = require("playwright");
const countryUrls = require("./data/countryPageUrls.json");
const coronaUrls = require("./data/coronaPageUrls.json");
const fs = require("fs");

const COUNTRY_PAGE_FILE = "./data/countryPageUrls.json";
const CORONA_PAGE_FILE = "./data/coronaPageUrls.json";
const BASE_URL = "https://www.gov.uk/foreign-travel-advice";

(async () => {
  // Launch chrome
  const browser = await chromium.launch();
  // Country corona page links
  let coronaPageLinks = [...coronaUrls];
  // Iterate country links
  for (let i = 0; i < countryPageLinks.length; i++) {
    // Get this link
    const link = countryPageLinks[i];
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
        document.querySelector(
          '[href*="entry-requirements#entry-rules-in-response-to-coronavirus-covid-19"]'
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
  // Check if there are any new corona page links
  if (JSON.stringify(coronaPageLinks) !== JSON.stringify(coronaUrls)) {
    fs.writeFileSync(
      CORONA_PAGE_FILE,
      JSON.stringify(coronaPageLinks, null, 2)
    );
  }
  // Close the browser
  await browser.close();
  // Exit
  process.exit(0);
})();
