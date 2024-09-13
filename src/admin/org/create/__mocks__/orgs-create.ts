import { GraphQLError } from "graphql";
import {
  SubscriptionCreateV2MutationVariables,
  OrgCreateDocument,
  OrgCreateMutation,
  OrgCreateMutationVariables,
  OrgsDocument,
  OrgsQuery,
  SubscriptionCreateV2Mutation,
  SubscriptionCreateV2Document,
  SubscriptionPlansDocument
} from "../__generated__/org-create";
import { SubscriptionPlansQuery } from "generated-graphql";

export function generateDummyOrgs(length = 3): NonNullable<OrgsQuery["orgs"]> {
  return Array.from({ length }, (_, i) => ({
    __typename: "Org",
    id: `org-${i}`,
    company: {
      __typename: "Company",
      id: `company-${i}`,
      name: `Org ${i}`
    }
  }));
}

export type MockOrgsQueryOpts = {
  orgs?: NonNullable<OrgsQuery["orgs"]>;
};

export function mockOrgsQuery({ orgs }: MockOrgsQueryOpts = {}) {
  const data: OrgsQuery = {
    orgs: orgs ?? generateDummyOrgs()
  };

  return {
    request: { query: OrgsDocument },
    result: { data }
  };
}

export type MockOrgCreateMutationOpts = {
  company: OrgCreateMutationVariables["input"]["company"];
  errors?: GraphQLError[];
};

export function mockOrgCreateMutation({ company, errors }: MockOrgCreateMutationOpts) {
  const variables: OrgCreateMutationVariables = { input: { company } };
  const data: OrgCreateMutation = {
    orgCreate: {
      __typename: "Org",
      id: "999",
      company: {
        __typename: "Company",
        id: "999",
        name: company.name
      }
    }
  };

  return {
    request: { query: OrgCreateDocument, variables },
    result: { data, errors }
  };
}

export type MockSubsCreateMutationOpts = {
  vars?: SubscriptionCreateV2MutationVariables;
  errors?: GraphQLError[];
};

export function mockSubsCreateMutation({ vars, errors }: MockSubsCreateMutationOpts) {
  const variables: SubscriptionCreateV2MutationVariables = {
    orgId: "1",
    subscriptions: [],
    ...vars
  };
  const data: SubscriptionCreateV2Mutation = {
    subscriptionCreateV2: [{ id: "999" }]
  };

  return {
    request: { query: SubscriptionCreateV2Document, variables },
    result: { data, errors }
  };
}

export type MockSubsriptionPlansQueryOpts = {
  plans?: SubscriptionPlansQuery["subscriptionPlans"];
};

export function mockSubsriptionPlansQuery({ plans }: MockSubsriptionPlansQueryOpts = {}) {
  const data: SubscriptionPlansQuery = {
    __typename: "Query",
    subscriptionPlans: plans ?? []
  };

  return {
    request: { query: SubscriptionPlansDocument },
    result: { data }
  };
}
