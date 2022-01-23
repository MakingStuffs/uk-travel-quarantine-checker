const coronaPages = require("./data/coronaPageUrls.json");
const countryPageUrls = require("./data/countryPageUrls.json");
const combined = require("./data/combinedData.json");
const fs = require("fs");

const getCountryFromUrl = (url) =>
  url.match(/(?:advice\/)([a-z-]+)\/?/g)[0].split("/")[1];

const countries = [
  ...combined,
  ...countryPageUrls.reduce((op, curr) => {
    const country = getCountryFromUrl(curr);
    const coronaPage = coronaPages.find((p) => p.includes(country));
    const hasRecord = !!combined.find((o) => o.country === country);

    if (!!coronaPage && !hasRecord) {
      op.push({ country, coronaPage, countryPage: curr });
    }

    return op;
  }, []),
];

if (JSON.stringify(combined) !== JSON.stringify(countries)) {
  fs.writeFileSync(
    "./data/combinedData.json",
    JSON.stringify(countries, null, 2)
  );
}
// Exit the process
process.exit(0);
