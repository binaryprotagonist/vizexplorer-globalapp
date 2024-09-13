import { fireEvent, render, waitFor, within } from "@testing-library/react";
import { OrgCreate } from "./org-create";
import {
  MockOrgCreateMutationOpts,
  MockOrgsQueryOpts,
  MockSubsCreateMutationOpts,
  MockSubsriptionPlansQueryOpts,
  generateDummyOrgs,
  mockOrgCreateMutation,
  mockOrgsQuery,
  mockSubsCreateMutation,
  mockSubsriptionPlansQuery
} from "./__mocks__/orgs-create";
import { MockedProvider } from "testing/graphql-provider";
import { AlertProvider } from "view-v2/alert";
import { getInput, updateInput } from "testing/utils";
import { GraphQLError } from "graphql";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { NewOrg } from "./types";
import { mockSubBuilderSubPlans } from "view-v2/subscription/add-subscription/__mocks__/subscription-builder";
import { addYears, format, startOfToday } from "date-fns";

describe("<OrgCreate />", () => {
  let orgsQueryOpts: MockOrgsQueryOpts;
  let subsriptionPlansQueryOpts: MockSubsriptionPlansQueryOpts;
  let orgCreateMutationOpts: MockOrgCreateMutationOpts;
  let subCreateMutationOpts: MockSubsCreateMutationOpts;

  beforeEach(() => {
    orgsQueryOpts = { orgs: generateDummyOrgs() };
    subsriptionPlansQueryOpts = { plans: mockSubBuilderSubPlans };
    orgCreateMutationOpts = {
      company: {
        name: "New Org",
        email: "neworg@test.com",
        phone: "+12015550123",
        street1: "123 Fake St",
        street2: "",
        city: "Springfield",
        country: "US",
        region: "",
        postalCode: "123"
      }
    };
    subCreateMutationOpts = {
      vars: {
        orgId: "999",
        subscriptions: [
          {
            planId: "pdre-onprem-elite-annual",
            periodEndDate: addYears(startOfToday(), 1)
          }
        ]
      }
    };
  });

  function wrapper({ children }: any) {
    return (
      <AlertProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MockedProvider
            mocks={[
              mockOrgsQuery(orgsQueryOpts),
              mockOrgCreateMutation(orgCreateMutationOpts),
              mockSubsriptionPlansQuery(subsriptionPlansQueryOpts),
              mockSubsCreateMutation(subCreateMutationOpts)
            ]}
          >
            {children}
          </MockedProvider>
        </LocalizationProvider>
      </AlertProvider>
    );
  }

  describe("<OrgCreateForm />", () => {
    it("renders", async () => {
      const { getByTestId } = render(<OrgCreate />, { wrapper });

      // prevent act warning due to lazy loaded component: https://github.com/testing-library/react-testing-library/issues/1216
      await waitFor(() => {});

      expect(getByTestId("org-create")).toBeInTheDocument();
    });

    describe("Step 1: OrgCreateForm", () => {
      it("renders org create form", () => {
        const { getByTestId } = render(<OrgCreate />, { wrapper });

        expect(getByTestId("org-create-form")).toBeInTheDocument();
      });

      it("renders org name taken error if the entered name is taken", async () => {
        orgsQueryOpts.orgs![0].company!.name = "Existing Org";
        const { getByTestId, getByText } = render(<OrgCreate />, { wrapper });

        await waitFor(() => {
          expect(getByTestId("org-name")).toBeEnabled();
        });

        updateInput(getByTestId("org-name"), "EXISTING ORG");

        expect(
          getByText("This name already exists", { exact: false })
        ).toBeInTheDocument();
      });

      it("calls onClose when org create form cancel button is clicked", async () => {
        const onClose = jest.fn();
        const { getByText } = render(<OrgCreate onClose={onClose} />, { wrapper });

        await waitFor(() => {});

        fireEvent.click(getByText("Cancel"));

        expect(onClose).toHaveBeenCalled();
      });

      it("calls displays org create success dialog and runs onOrgCreated when an org is created", async () => {
        const onOrgCreated = jest.fn();
        const { getByTestId, getByText, getByLabelText } = render(
          <OrgCreate onOrgCreated={onOrgCreated} onClose={() => {}} />,
          { wrapper }
        );

        await waitFor(() => {
          expect(getByTestId("org-name")).toBeEnabled();
        });

        const { company } = orgCreateMutationOpts;
        const phone = company.phone.split("+1")[1];
        updateInput(getByTestId("org-name"), company.name);
        updateInput(getByTestId("email"), company.email);
        updateInput(getByLabelText("Phone number"), phone);
        updateInput(getByTestId("address-line-1"), company.street1);
        updateInput(getByTestId("city"), company.city);
        updateInput(getByTestId("zip"), company.postalCode);
        await waitFor(() => {});

        fireEvent.click(getByText("Save"));

        // verify various elements are correctly disabled during save
        expect(getByTestId("save-btn")).not.toHaveTextContent("Save");
        expect(getByText("Cancel")).toBeDisabled();

        await waitFor(() => {
          expect(onOrgCreated).toHaveBeenCalledWith("999", company.name);
        });
        expect(getByTestId("add-subscription-form")).toBeInTheDocument();
      });

      it("displays an alert and doesn't call onOrgCreated if there is an error saving the org", async () => {
        orgCreateMutationOpts.errors = [new GraphQLError("Invalid address")];
        const onOrgCreated = jest.fn();
        const { getByTestId, getByText, getByLabelText, findByTestId } = render(
          <OrgCreate onOrgCreated={onOrgCreated} />,
          { wrapper }
        );

        await waitFor(() => {
          expect(getByTestId("org-name")).toBeEnabled();
        });

        const { company } = orgCreateMutationOpts;
        const phone = company.phone.split("+1")[1];
        updateInput(getByTestId("org-name"), company.name);
        updateInput(getByTestId("email"), company.email);
        updateInput(getByLabelText("Phone number"), phone);
        updateInput(getByTestId("address-line-1"), company.street1);
        updateInput(getByTestId("city"), company.city);
        updateInput(getByTestId("zip"), company.postalCode);
        await waitFor(() => {});

        fireEvent.click(getByText("Save"));

        const alert = await findByTestId("alert");
        expect(alert).toHaveTextContent("Invalid address");
        expect(onOrgCreated).not.toHaveBeenCalled();
      });

      it("calls onClickAccess if Access organization is clicked on the success dialog", async () => {
        const onClickAccess = jest.fn();
        const { getByTestId, getByText, getByLabelText } = render(
          <OrgCreate onClickAccess={onClickAccess} onClose={() => {}} />,
          { wrapper }
        );

        await waitFor(() => {
          expect(getByTestId("org-name")).toBeEnabled();
        });

        const { company } = orgCreateMutationOpts;
        const phone = company.phone.split("+1")[1];
        updateInput(getByTestId("org-name"), company.name);
        updateInput(getByTestId("email"), company.email);
        updateInput(getByLabelText("Phone number"), phone);
        updateInput(getByTestId("address-line-1"), company.street1);
        updateInput(getByTestId("city"), company.city);
        updateInput(getByTestId("zip"), company.postalCode);
        await waitFor(() => {});

        fireEvent.click(getByText("Save"));
      });

      it("calls onClose if Close button is clicked on the success dialog", async () => {
        const onClose = jest.fn();
        const { getByTestId, getByText, getByLabelText } = render(
          <OrgCreate onClose={onClose} />,
          { wrapper }
        );

        await waitFor(() => {
          expect(getByTestId("org-name")).toBeEnabled();
        });

        const { company } = orgCreateMutationOpts;
        const phone = company.phone.split("+1")[1];
        updateInput(getByTestId("org-name"), company.name);
        updateInput(getByTestId("email"), company.email);
        updateInput(getByLabelText("Phone number"), phone);
        updateInput(getByTestId("address-line-1"), company.street1);
        updateInput(getByTestId("city"), company.city);
        updateInput(getByTestId("zip"), company.postalCode);
        await waitFor(() => {});

        fireEvent.click(getByText("Save"));
      });
    });
  });

  describe("Step 2: AddSubscriptionForm", () => {
    const mockNewOrg: NewOrg = { id: "999", name: "New Org" };

    it("renders add subscription form", () => {
      const { getByTestId } = render(<OrgCreate step={1} newOrg={mockNewOrg} />, {
        wrapper
      });

      expect(getByTestId("add-subscription-form")).toBeInTheDocument();
    });

    it("displays org creation success dialog upon successful subscription creation", async () => {
      const { getByTestId, getByText, findByTestId } = render(
        <OrgCreate step={1} newOrg={mockNewOrg} />,
        { wrapper }
      );

      await waitFor(() => {
        expect(getInput(getByTestId("environment-field"))).toBeEnabled();
      });

      fireEvent.click(within(getByTestId("environment-field")).getByRole("button"));
      fireEvent.click(getByText("On-Premises"));
      fireEvent.click(within(getByTestId("application-select")).getByRole("button"));
      fireEvent.click(getByText("PD Rec Engine"));
      updateInput(
        getByTestId("expiration-date-select"),
        format(addYears(startOfToday(), 1), "dd MMMM yyyy")
      );

      fireEvent.click(getByText("Save"));

      await findByTestId("org-create-success-dialog");
    });

    it("displays org creation success dialog if Skip is clicked", () => {
      const { getByTestId, getByText } = render(
        <OrgCreate step={1} newOrg={mockNewOrg} />,
        { wrapper }
      );

      fireEvent.click(getByText("Skip"));

      expect(getByTestId("org-create-success-dialog")).toBeInTheDocument();
    });

    it("displays an alert if there is an error adding subscription", async () => {
      subCreateMutationOpts.errors = [new GraphQLError("Org not found")];
      const { getByTestId, getByText, findByTestId } = render(
        <OrgCreate step={1} newOrg={mockNewOrg} />,
        { wrapper }
      );

      await waitFor(() => {
        expect(getInput(getByTestId("environment-field"))).toBeEnabled();
      });

      fireEvent.click(within(getByTestId("environment-field")).getByRole("button"));
      fireEvent.click(getByText("On-Premises"));
      fireEvent.click(within(getByTestId("application-select")).getByRole("button"));
      fireEvent.click(getByText("PD Rec Engine"));
      updateInput(
        getByTestId("expiration-date-select"),
        format(addYears(startOfToday(), 1), "dd MMMM yyyy")
      );

      fireEvent.click(getByText("Save"));

      const alert = await findByTestId("alert");
      expect(alert).toHaveTextContent("Org not found");
    });
  });
});
