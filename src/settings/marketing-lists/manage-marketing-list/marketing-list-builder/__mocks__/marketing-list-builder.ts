import {
  MarketingProgramsDocument,
  MarketingProgramsQuery,
  MarketingProgramsQueryVariables
} from "../__generated__/marketing-list-builder";

export function generateDummyMarketingPrograms(
  length = 3
): MarketingProgramsQuery["pdMarketingPrograms"] {
  return Array.from({ length: length }, (_, i) => ({
    __typename: "PdMarketingProgram",
    id: `${i}`,
    name: `Program ${i}`
  }));
}

export type MockMarketingProgramsQueryOpts = {
  vars?: MarketingProgramsQueryVariables;
  programs?: MarketingProgramsQuery["pdMarketingPrograms"];
};

export function mockMarketingProgramsQuery({
  vars,
  programs
}: MockMarketingProgramsQueryOpts = {}) {
  const variables: MarketingProgramsQueryVariables = { siteId: "0", ...vars };
  const data: MarketingProgramsQuery = {
    pdMarketingPrograms: programs ?? generateDummyMarketingPrograms()
  };

  return {
    request: {
      query: MarketingProgramsDocument,
      variables
    },
    result: { data }
  };
}
