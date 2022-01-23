const { chromium } = require("playwright");
const countryUrls = require("../data/countryPageUrls.json");
const fs = require("fs");

const COUNTRY_PAGE_FILE = "../data/countryPageUrls.json";
const BASE_URL = "https://www.gov.uk/foreign-travel-advice";

(async () => {
  // Launch chrome
  const browser = await chromium.launch();
  // get a page
  let page = await browser.newPage();
  // Go to base url
  await page.goto(BASE_URL);
  // Check if the page has loaded
  const hasLoaded = await page.evaluate(
    () => document.readyState === "complete"
  );
  // If we haven't loaded wait for the load event then use that page
  if (!hasLoaded) {
    // Wait for page load event
    [page] = await Promise.all([page.waitForEvent("load")]);
  }
  // Get links
  const countryPageLinks = await page.evaluate(() =>
    [...document.querySelectorAll(".govuk-link.countries-list__link")].map(
      (l) => l.href
    )
  );
  // temp urls
  let temp = [...countryUrls];
  // Check if the links we just got include any which are not in the urls already
  countryPageLinks.some((link) => {
    if (!temp.includes(link)) {
      temp.push(link);
    }
  });
  // Check if we should re save country urls
  if (JSON.stringify(temp) !== JSON.stringify(countryUrls)) {
    fs.writeFileSync(COUNTRY_PAGE_FILE, JSON.stringify(temp, null, 2));
  }
  // Close that page
  await page.close();
  // Close the browser
  await browser.close();
  // exit
  process.exit(0);
})();
