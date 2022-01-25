export type SimpleApiResponse = {
  data: string[] | CombinedPageData[];
  message: string;
  length: number;
};

export type CombinedPageData = {
  country: string;
  coronaPage: string;
  countryPage: string;
};
