import {
  mockCreateSiteMutation,
  mockUpdateSiteMutation
} from "../../../view/testing/mocks";
import { MockAuthProvider, MockRecoilProvider } from "@vizexplorer/global-ui-core";
import { ThemeProvider } from "../../../theme";
import { act, fireEvent, render, waitFor, within } from "@testing-library/react";
import { ManageSiteDialog } from "./manage-site-dialog";
import { SiteFragment } from "generated-graphql";
import { GraphQLError } from "graphql";
import { InMemoryCache } from "@apollo/client";
import { MockedProvider } from "testing/graphql-provider";
import { cacheConfig } from "../../../view/graphql";
import { getInput, updateInput } from "testing/utils";
import { defaultTimezone } from "../../../view/utils";

describe("<ManageSiteDialog />", () => {
  let siteCreationErr: GraphQLError | string = "";
  let siteUpdateErr: GraphQLError | string = "";
  let newSite: SiteFragment;
  const preUpdateSite: SiteFragment = {
    id: "1",
    name: "pre-update",
    tz: "UTC"
  };
  let postUpdateSite: SiteFragment;
  const cache = new InMemoryCache(cacheConfig);

  beforeEach(() => {
    siteCreationErr = "";
    siteUpdateErr = "";
    newSite = {
      __typename: "Site",
      id: "1",
      name: "site 1",
      currency: { code: "USD" },
      tz: defaultTimezone().tzCode
    };
    postUpdateSite = {
      ...newSite,
      name: "new name",
      currency: null,
      tz: "UTC"
    };
    cache.restore({});
  });

  function wrapper({ children }: any) {
    return (
      <MockRecoilProvider>
        <MockAuthProvider>
          <MockedProvider
            cache={cache}
            mocks={[
              mockCreateSiteMutation(newSite, siteCreationErr),
              mockUpdateSiteMutation(postUpdateSite, siteUpdateErr)
            ]}
          >
            <ThemeProvider>{children}</ThemeProvider>
          </MockedProvider>
        </MockAuthProvider>
      </MockRecoilProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<ManageSiteDialog onClose={() => {}} />, {
      wrapper
    });

    expect(getByTestId("manage-site-dialog")).toBeInTheDocument();
  });

  it("renders inputs", () => {
    const { getByTestId } = render(<ManageSiteDialog onClose={() => {}} />, {
      wrapper
    });

    expect(getByTestId("property-name-input")).toBeInTheDocument();
    expect(getByTestId("timezone-input")).toBeInTheDocument();
  });

  // We only test changing the TZ to ensure state is updating correctly.
  // Avoid testing along side editing/creation APIs as it's a very expensive operation
  it("can change timezone", () => {
    const { getByTestId, getByRole } = render(
      <ManageSiteDialog site={newSite} onClose={() => {}} />,
      { wrapper }
    );

    const tzInput = within(getByTestId("timezone-input")).getByRole("combobox");
    expect(tzInput).toHaveValue(defaultTimezone().name);

    act(() => {
      tzInput.focus();
    });
    updateInput(getByTestId("timezone-input"), "Midway");
    fireEvent.click(getByRole("option"));

    expect(tzInput).toHaveValue("(GMT-11:00) Midway");
  });

  it("renders actions", () => {
    const { getByText } = render(<ManageSiteDialog onClose={() => {}} />, {
      wrapper
    });

    expect(getByText("Cancel")).toBeInTheDocument();
    expect(getByText("Save")).toBeInTheDocument();
  });

  it("runs onClose when `Cancel` is clicked", () => {
    const onClose = jest.fn();
    const { getByText } = render(<ManageSiteDialog onClose={onClose} />, {
      wrapper
    });

    fireEvent.click(getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("runs onClose when the backdrop is clicked", () => {
    const onClose = jest.fn();
    const { getAllByRole } = render(<ManageSiteDialog onClose={onClose} />, {
      wrapper
    });

    fireEvent.click(getAllByRole("presentation")[0].firstChild!);
    expect(onClose).toHaveBeenCalled();
  });

  it("disables `Save` while name is blank", () => {
    const { getByText } = render(<ManageSiteDialog onClose={() => {}} />, {
      wrapper
    });

    expect(getByText("Save")).toBeDisabled();
  });

  it("disables `Save` if name is comprised of spaces only", () => {
    const { getByTestId, getByText } = render(<ManageSiteDialog onClose={() => {}} />, {
      wrapper
    });

    updateInput(getByTestId("property-name-input"), "  ");
    expect(getByText("Save")).toBeDisabled();
  });

  describe("Create Site", () => {
    it("renders expected title", () => {
      const { getByText } = render(<ManageSiteDialog onClose={() => {}} />, {
        wrapper
      });

      expect(getByText("Add Property")).toBeInTheDocument();
    });

    it("renders timezone selection", () => {
      const { getByTestId } = render(<ManageSiteDialog onClose={() => {}} />, {
        wrapper
      });

      expect(getByTestId("timezone-input")).toBeInTheDocument();
    });

    it("defaults currency to `USD` by default", () => {
      const { getByText } = render(<ManageSiteDialog onClose={() => {}} />, {
        wrapper
      });

      expect(getByText("$ USD")).toBeInTheDocument();
    });

    it("disables `Cancel` and `Save` during site creation", () => {
      const { getByTestId, getByText } = render(<ManageSiteDialog onClose={() => {}} />, {
        wrapper
      });

      updateInput(getByTestId("property-name-input"), newSite.name);

      fireEvent.click(getByText("Save"));

      expect(getByText("Cancel")).toBeDisabled();
      expect(getByText("Save")).toBeDisabled();
    });

    it("runs onClose upon successful site creation", async () => {
      const onClose = jest.fn();
      const { getByTestId, getByText } = render(<ManageSiteDialog onClose={onClose} />, {
        wrapper
      });

      updateInput(getByTestId("property-name-input"), newSite.name);
      fireEvent.click(getByText("Save"));

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });

    it("adds the created property to Cache", async () => {
      const cacheId = cache.identify(newSite)!;
      const { getByTestId, getByText } = render(<ManageSiteDialog onClose={() => {}} />, {
        wrapper
      });

      expect(Object.keys(cache.extract())).not.toContain(cacheId);
      updateInput(getByTestId("property-name-input"), newSite.name);
      fireEvent.click(getByText("Save"));

      await waitFor(() => {
        expect(Object.keys(cache.extract())).toContain(cacheId);
      });
    });

    it("renders any errors returns from the api call", async () => {
      console.log = jest.fn(); // mute graphql error logging
      siteCreationErr = "something went wrong";
      const { getByTestId, getByText, findByText } = render(
        <ManageSiteDialog onClose={() => {}} />,
        { wrapper }
      );

      updateInput(getByTestId("property-name-input"), newSite.name);
      fireEvent.click(getByText("Save"));

      await findByText(siteCreationErr);
    });

    it("renders custom error message on property name conflicts", async () => {
      console.log = jest.fn(); // mute graphql error logging
      siteCreationErr = new GraphQLError("", null, null, null, null, null, {
        code: "NAME_EXISTS"
      });
      const { getByTestId, getByText, findByText } = render(
        <ManageSiteDialog onClose={() => {}} />,
        { wrapper }
      );

      updateInput(getByTestId("property-name-input"), newSite.name);
      fireEvent.click(getByText("Save"));

      await findByText(`Property ${newSite.name} already exists`);
    });

    it("removes error message upon changing the site name", async () => {
      console.log = jest.fn(); // mute graphql error logging
      siteCreationErr = "something went wrong";
      const { getByTestId, getByText, queryByText, findByText } = render(
        <ManageSiteDialog onClose={() => {}} />,
        { wrapper }
      );

      // Produce and validate error occurred
      updateInput(getByTestId("property-name-input"), newSite.name);
      fireEvent.click(getByText("Save"));

      await findByText(siteCreationErr);
      expect(getByText(siteCreationErr)).toBeInTheDocument();

      // change input and validate error has been removed
      updateInput(getByTestId("property-name-input"), "new name");
      expect(queryByText(siteCreationErr)).not.toBeInTheDocument();
    });

    it("removes excess spaces from the name before saving", async () => {
      const onClose = jest.fn();
      const { getByTestId, getByText } = render(<ManageSiteDialog onClose={onClose} />, {
        wrapper
      });

      updateInput(getByTestId("property-name-input"), `  ${newSite.name}  `);
      fireEvent.click(getByText("Save"));

      await waitFor(() => {
        // onclose should only run if the query succeeded, meaning the name matched without spaces
        expect(onClose).toHaveBeenCalled();
      });
    });
  });

  describe("Update Site", () => {
    it("renders expected title", () => {
      const { getByText } = render(
        <ManageSiteDialog site={preUpdateSite} onClose={() => {}} />,
        { wrapper }
      );

      expect(getByText("Edit Property")).toBeInTheDocument();
    });

    it("selects the correct currency", () => {
      const siteWCurrency: SiteFragment = {
        ...newSite,
        currency: { code: "EUR" }
      };

      const { getByText } = render(
        <ManageSiteDialog site={siteWCurrency} onClose={() => {}} />,
        { wrapper }
      );

      expect(getByText("€ EUR")).toBeInTheDocument();
    });

    it("selects the correct timezone", () => {
      const siteWCurrency: SiteFragment = {
        ...newSite,
        currency: { code: "EUR" },
        tz: "UTC"
      };

      const { getByTestId } = render(
        <ManageSiteDialog site={siteWCurrency} onClose={() => {}} />,
        { wrapper }
      );

      expect(getInput(getByTestId("timezone-input"))).toHaveValue(
        "(UTC) Coordinated Universal Time"
      );
    });

    it("defaults currency to None if not provided", () => {
      const siteWOCurrency: SiteFragment = { id: "1", name: "noCurrency" };

      const { getByText } = render(
        <ManageSiteDialog site={siteWOCurrency} onClose={() => {}} />,
        { wrapper }
      );

      expect(getByText("None")).toBeInTheDocument();
    });

    it("defaults timezone if not provided", () => {
      const siteWOTz: SiteFragment = { id: "1", name: "noTz" };

      const { getByTestId } = render(
        <ManageSiteDialog site={siteWOTz} onClose={() => {}} />,
        { wrapper }
      );

      expect(getInput(getByTestId("timezone-input"))).toHaveValue(defaultTimezone().name);
    });

    it("disables `Cancel` and `Save` during site update", () => {
      const { getByTestId, getByText } = render(
        <ManageSiteDialog site={preUpdateSite} onClose={() => {}} />,
        { wrapper }
      );

      updateInput(getByTestId("property-name-input"), postUpdateSite.name);
      fireEvent.click(getByText("Save"));

      expect(getByText("Cancel")).toBeDisabled();
      expect(getByText("Save")).toBeDisabled();
    });

    it("runs onClose upon successful site update", async () => {
      const onClose = jest.fn();
      const { getByTestId, getByText } = render(
        <ManageSiteDialog site={preUpdateSite} onClose={onClose} />,
        { wrapper }
      );

      updateInput(getByTestId("property-name-input"), postUpdateSite.name);
      fireEvent.click(getByText("Save"));

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });

    it("updates the property in Cache", async () => {
      postUpdateSite.currency = { code: "USD" };
      const cacheId = cache.identify(newSite)!;
      cache.restore({ [cacheId]: newSite });
      const { getByTestId, getByText } = render(
        <ManageSiteDialog site={preUpdateSite} onClose={() => {}} />,
        { wrapper }
      );

      // @ts-ignore
      expect(cache.extract()[cacheId]).toEqual(newSite);
      updateInput(getByTestId("property-name-input"), postUpdateSite.name);
      fireEvent.mouseDown(getByText("None"));
      fireEvent.click(getByText("$ USD"));
      fireEvent.click(getByText("Save"));

      await waitFor(() => {
        const newName = cache.extract()[cacheId]!.name;
        expect(newName).toEqual(postUpdateSite.name);
      });
    });

    it("renders any errors returns from the api call", async () => {
      console.log = jest.fn(); // mute graphql error logging
      siteUpdateErr = "something went wrong";
      const { getByTestId, getByText, findByText } = render(
        <ManageSiteDialog site={preUpdateSite} onClose={() => {}} />,
        { wrapper }
      );

      updateInput(getByTestId("property-name-input"), postUpdateSite.name);
      fireEvent.click(getByText("Save"));

      await findByText(siteUpdateErr);
    });

    it("renders custom error message on property name conflicts", async () => {
      console.log = jest.fn(); // mute graphql error logging
      siteUpdateErr = new GraphQLError("", null, null, null, null, null, {
        code: "NAME_EXISTS"
      });
      const { getByTestId, getByText, findByText } = render(
        <ManageSiteDialog site={preUpdateSite} onClose={() => {}} />,
        { wrapper }
      );

      updateInput(getByTestId("property-name-input"), postUpdateSite.name);
      fireEvent.click(getByText("Save"));

      await findByText(`Property ${postUpdateSite.name} already exists`);
    });

    it("removes error message upon changing the site name", async () => {
      console.log = jest.fn(); // mute graphql error logging
      siteUpdateErr = "Update Failed";
      const { getByTestId, getByText, queryByText, findByText } = render(
        <ManageSiteDialog site={preUpdateSite} onClose={() => {}} />,
        { wrapper }
      );

      // Produce and validate error occurred
      updateInput(getByTestId("property-name-input"), postUpdateSite.name);
      fireEvent.click(getByText("Save"));
      await findByText(siteUpdateErr);

      // change input and validate error has been removed
      updateInput(getByTestId("property-name-input"), "_");
      expect(queryByText(siteUpdateErr)).not.toBeInTheDocument();
    });

    it("removes excess spaces from the name before updating", async () => {
      const onClose = jest.fn();
      const { getByTestId, getByText } = render(
        <ManageSiteDialog site={preUpdateSite} onClose={onClose} />,
        { wrapper }
      );

      updateInput(getByTestId("property-name-input"), `  ${postUpdateSite.name}  `);
      fireEvent.click(getByText("Save"));

      await waitFor(() => {
        // onclose should only run if the query succeeded
        expect(onClose).toHaveBeenCalled();
      });
    });
  });
});
