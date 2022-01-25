import coronaPages from "../data/covidPageUrls.json";
import countryPageUrls from "../data/countryPageUrls.json";
import combined from "../data/combinedPages.json";
import fs from "fs";
import path from "path";

const getCountryFromUrl = (url: string) =>
  /(?:advice\/)([a-z-]+)\/?/g.test(url)
    ? url.match(/(?:advice\/)([a-z-]+)\/?/g)![0].split("/")[1]
    : null;

export const getCombinedPages = () => {
  console.log(`Updated combined JSON for ${coronaPages.length} countries`);
  const countries = [
    ...combined,
    ...countryPageUrls.reduce((op: any[], curr) => {
      const country = getCountryFromUrl(curr) as string;
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
      path.resolve(__dirname, "../data/combinedPages.json"),
      JSON.stringify(countries, null, 2)
    );
  }
};
