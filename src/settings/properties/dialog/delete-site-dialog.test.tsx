import { fireEvent, render, waitFor } from "@testing-library/react";
import { DeleteSiteDialog } from "./delete-site-dialog";
import { MockAuthProvider, MockRecoilProvider } from "@vizexplorer/global-ui-core";
import { ThemeProvider } from "../../../theme";
import { mockDeleteSiteMutation } from "../../../view/testing/mocks";
import { SiteFragment } from "generated-graphql";
import { InMemoryCache } from "@apollo/client";
import { MockedProvider } from "testing/graphql-provider";
import { cacheConfig } from "../../../view/graphql";

const mockSite: SiteFragment = {
  __typename: "Site",
  id: "1",
  name: "test 1"
};

describe("<DeleteSiteDialog />", () => {
  const cache = new InMemoryCache(cacheConfig);

  beforeEach(() => {
    cache.restore({});
  });

  function wrapper({ children }: any) {
    return (
      <MockRecoilProvider>
        <MockAuthProvider>
          <MockedProvider cache={cache} mocks={[mockDeleteSiteMutation(mockSite.id)]}>
            <ThemeProvider>{children}</ThemeProvider>
          </MockedProvider>
        </MockAuthProvider>
      </MockRecoilProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(
      <DeleteSiteDialog site={mockSite} onClose={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("delete-site-dialog")).toBeInTheDocument();
  });

  it("renders delete message", () => {
    const { getByTestId } = render(
      <DeleteSiteDialog site={mockSite} onClose={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("delete-site-message")).toBeInTheDocument();
  });

  it("renders actions", () => {
    const { getByText } = render(
      <DeleteSiteDialog site={mockSite} onClose={() => {}} />,
      { wrapper }
    );

    expect(getByText("Cancel")).toBeInTheDocument();
    expect(getByText("Delete")).toBeInTheDocument();
  });

  it("runs onclose if `Cancel` is clicked", () => {
    const onClose = jest.fn();
    const { getByText } = render(<DeleteSiteDialog site={mockSite} onClose={onClose} />, {
      wrapper
    });

    fireEvent.click(getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("runs onClose if the backdrop is clicked", () => {
    const onClose = jest.fn();
    const { getAllByRole } = render(
      <DeleteSiteDialog site={mockSite} onClose={onClose} />,
      { wrapper }
    );

    fireEvent.click(getAllByRole("presentation")[0].firstChild!);
    expect(onClose).toHaveBeenCalled();
  });

  it("runs onClose when deletion is complete", async () => {
    const onClose = jest.fn();
    const { getByText } = render(<DeleteSiteDialog site={mockSite} onClose={onClose} />, {
      wrapper
    });

    fireEvent.click(getByText("Delete"));
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("removes site reference from Cache on delete", async () => {
    const cacheId = `${mockSite.__typename}:${mockSite.id}`;
    cache.restore({ [cacheId]: mockSite });
    const { getByText } = render(
      <DeleteSiteDialog site={mockSite} onClose={() => {}} />,
      { wrapper }
    );

    expect(Object.keys(cache.extract())).toContain(cacheId);
    fireEvent.click(getByText("Delete"));

    await waitFor(() => {
      expect(Object.keys(cache.extract())).not.toContain(cacheId);
    });
  });

  it("doesn't disable `Cancel` and `Delete` while not deleting", () => {
    const { getByText } = render(
      <DeleteSiteDialog site={mockSite} onClose={() => {}} />,
      { wrapper }
    );

    expect(getByText("Cancel")).not.toBeDisabled();
    expect(getByText("Delete")).not.toBeDisabled();
  });

  it("disables `Cancel` and `Delete` buttons while deleting", () => {
    const { getByText } = render(
      <DeleteSiteDialog site={mockSite} onClose={() => {}} />,
      { wrapper }
    );

    fireEvent.click(getByText("Delete"));
    expect(getByText("Cancel")).toBeDisabled();
    expect(getByText("Delete")).toBeDisabled();
  });
});
