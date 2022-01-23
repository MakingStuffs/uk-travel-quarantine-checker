const data = require("./data/combinedData.json");
const possibleCountries = require("./data/possibleCountries.json");
const fs = require("fs");

const { chromium } = require("playwright");

(async () => {
  // Launch chrome
  const browser = await chromium.launch();
  // Log
  console.log("Checking all countries");
  // Make temp obj to compare with original
  const temp = [...possibleCountries];
  // iterate countries
  for (let i = 0; i < data.length; i++) {
    console.log(`Checking country ${data[i].country}`);
    // get a page
    let page = await browser.newPage();
    // Go to base url
    await page.goto(data[i].coronaPage);
    // Check if the page has loaded
    const hasLoaded = await page.evaluate(
      () => document.readyState === "complete"
    );
    // If we haven't loaded wait for the load event then use that page
    if (!hasLoaded) {
      // Wait for page load event
      [page] = await Promise.all([page.waitForEvent("load")]);
    }
    // Check if there is mention of quarantine without variables
    const possibleRestrictions = await page.evaluate(() => {
      const body = document.body.outerHTML;
      const mentionsQuarantine = /quarantine/gi.test(body);
      if (!!mentionsQuarantine) {
        const withConditions = /quarantine([a-z ]*?depending)/gi.test(body);
        return !withConditions;
      } else {
        return false;
      }
    });
    // try find this country's entry
    const entry = temp.find((c) => c.country === data[i].country);
    // Check if the possible countries contains this one
    if (!possibleRestrictions && !!!entry) {
      temp.push(data[i]);
    } else if (possibleRestrictions && !!entry) {
      // Remove this one
      temp = temp.filter((c) => c.country !== data[i].country);
    }
    // Close the page
    await page.close();
  }
  // Log
  console.log("Finished checking");
  // Check if there are any changes
  if (JSON.stringify(temp) !== JSON.stringify(possibleCountries)) {
    // Log
    console.log("Changes detected, writing file");
    // Write the file
    fs.writeFileSync(
      "./data/possibleCountries.json",
      JSON.stringify(possibleCountries, null, 2)
    );
  }
  // Close the browser
  await browser.close();
  // exit the process
  process.exit(0);
})();
