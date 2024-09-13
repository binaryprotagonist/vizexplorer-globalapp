import {
  CompanyDocument,
  GaCompanyFragment,
  CompanyInput,
  CompanyUpdateDocument,
  CompanyUpdateOutputFragment,
  CompanyQuery
} from "generated-graphql";

export const mockCompany: GaCompanyFragment = {
  __typename: "Company",
  id: "company_1",
  name: "test company",
  email: "test.company@test.com",
  address: {
    __typename: "Address",
    phone: "11223344",
    country: "NZ",
    region: "wellington city",
    city: "wellington",
    street1: "123 company street",
    street2: "company street 2",
    postalCode: "5511"
  }
};

export function mockCompanyQuery(company?: Partial<GaCompanyFragment>) {
  const data: CompanyQuery = {
    currentOrg: {
      id: "1",
      company: {
        __typename: "Company",
        ...mockCompany,
        ...company,
        address: {
          __typename: "Address",
          ...mockCompany.address,
          ...company?.address
        }
      }
    }
  };

  return {
    request: {
      query: CompanyDocument
    },
    result: {
      data
    }
  };
}

export function mockCompanyUpdate(newCompany: GaCompanyFragment, error?: string) {
  return {
    request: {
      query: CompanyUpdateDocument,
      variables: { input: companyAsCompanyInput(newCompany) }
    },
    result: {
      data: {
        companyUpdate: companyAsCompanyOutput(newCompany)
      }
    },
    error: error ? Error(error) : undefined
  };
}

function companyAsCompanyInput(company: GaCompanyFragment): CompanyInput {
  const companyInput: CompanyInput = {
    name: company.name,
    email: company.email,
    ...company.address
  };
  // remove `__typename` as it is not needed and Apollo is sensitive about unnecessary fields
  delete (companyInput as any).__typename;

  return companyInput;
}

function companyAsCompanyOutput(company: GaCompanyFragment): CompanyUpdateOutputFragment {
  return {
    __typename: "Company",
    id: company.id,
    name: company.name,
    email: company.email,
    address: {
      ...company.address
    }
  };
}
