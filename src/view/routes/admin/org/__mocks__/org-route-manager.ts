import _ from "lodash";
import { CurrentOrgDocument, CurrentOrgQuery } from "../__generated__/org-route-manager";

export function mockCurrentOrgQuery() {
  const data: CurrentOrgQuery = {
    currentOrg: {
      __typename: "Org",
      id: "1"
    }
  };

  return {
    request: {
      query: CurrentOrgDocument
    },
    result: {
      data
    }
  };
}
