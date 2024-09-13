import { fireEvent, render, waitFor } from "@testing-library/react";
import { ManageMappingDialog } from "./manage-mapping-dialog";
import { MockedProvider } from "testing/graphql-provider";
import { AlertProvider } from "view-v2/alert";
import {
  MockHostMappingUpdateMutationOpts,
  MockUnammedNativeHostsQueryOpts,
  MockUserQueryOpts,
  mockHostMappingUpdateMutation,
  mockNativeHost,
  mockSiteQuery,
  mockUnmappedNativeHostsQuery,
  mockUser,
  mockUserQuery
} from "./__mocks__/manage-mapping-dialog";
import { UserDisplay } from "../../../../view/user/utils";
import { getInput } from "testing/utils";
import { act } from "react-dom/test-utils";
import { GraphQLError } from "graphql";
import { produce } from "immer";

describe("<ManageMappingDialog />", () => {
  let userQueryOpts: MockUserQueryOpts;
  let unmappedNativeHostsQueryOpts: MockUnammedNativeHostsQueryOpts;
  let mappingUpdateOpts: MockHostMappingUpdateMutationOpts;

  beforeEach(() => {
    userQueryOpts = { user: mockUser };
    unmappedNativeHostsQueryOpts = {
      pdNativeHosts: [
        {
          __typename: "PdNativeHost",
          nativeHostId: "100",
          firstName: "Jeff",
          lastName: "Kipper"
        },
        {
          __typename: "PdNativeHost",
          nativeHostId: "101",
          firstName: "Dave",
          lastName: "Peters"
        }
      ]
    };
  });

  function wrapper({ children }: any) {
    return (
      <AlertProvider>
        <MockedProvider
          mocks={[
            mockUserQuery(userQueryOpts),
            mockSiteQuery(),
            mockUnmappedNativeHostsQuery(unmappedNativeHostsQueryOpts),
            mockHostMappingUpdateMutation(mappingUpdateOpts)
          ]}
        >
          {children}
        </MockedProvider>
      </AlertProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(
      <ManageMappingDialog
        userId={"1"}
        siteId={"0"}
        onClose={() => {}}
        onSave={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("manage-mapping-dialog")).toBeInTheDocument();
  });

  it("renders description loading while loading", () => {
    const { getByTestId } = render(
      <ManageMappingDialog
        userId={"1"}
        siteId={"0"}
        onClose={() => {}}
        onSave={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("description-loading")).toBeInTheDocument();
  });

  it("renders user and site name in the description when loaded", async () => {
    const { findByTestId } = render(
      <ManageMappingDialog
        userId={"1"}
        siteId={"0"}
        onClose={() => {}}
        onSave={() => {}}
      />,
      { wrapper }
    );

    const description = await findByTestId("description");

    expect(description).toHaveTextContent(UserDisplay.fullNameV2(mockUser));
    expect(description).toHaveTextContent("MGM");
  });

  it("disables host code select while loading", () => {
    const { getByTestId } = render(
      <ManageMappingDialog
        userId={"1"}
        siteId={"0"}
        onClose={() => {}}
        onSave={() => {}}
      />,
      { wrapper }
    );

    expect(getInput(getByTestId("host-code-select"))).toBeDisabled();
  });

  it("fills user select with hosts the user is already mapped to for the selected site", async () => {
    userQueryOpts.user = produce(mockUser, (draft) => {
      draft.pdHostMappings![0].siteId = "1";
      draft.pdHostMappings!.push({
        __typename: "PdHostMapping",
        id: "230",
        siteId: "0",
        nativeHost: { ...mockNativeHost, nativeHostId: "544" }
      });
    });
    const { findAllByTestId } = render(
      <ManageMappingDialog
        userId={"1"}
        siteId={"0"}
        onClose={() => {}}
        onSave={() => {}}
      />,
      { wrapper }
    );

    const chips = await findAllByTestId("host-code-chip");

    // only include second mapping as the first is for a different property
    const user = userQueryOpts.user!;
    const nativeId = user.pdHostMappings![1].nativeHost!.nativeHostId;
    expect(chips).toHaveLength(1);
    expect(chips[0]).toHaveTextContent(nativeId);
  });

  it("displays expected tooltip when hovering a selected chip", async () => {
    jest.useFakeTimers();
    const { findAllByTestId, getByRole } = render(
      <ManageMappingDialog
        userId={"1"}
        siteId={"0"}
        onClose={() => {}}
        onSave={() => {}}
      />,
      { wrapper }
    );

    const chips = await findAllByTestId("host-code-chip");
    fireEvent.mouseOver(chips[0]);
    act(() => {
      jest.runOnlyPendingTimers();
    });

    const nativeName = UserDisplay.fullNameV2(mockUser.pdHostMappings![0].nativeHost!);
    expect(getByRole("tooltip")).toHaveTextContent(nativeName);
    jest.useRealTimers();
  });

  it("lists expected host code options", async () => {
    const { getByTestId, getAllByRole } = render(
      <ManageMappingDialog
        userId={"1"}
        siteId={"0"}
        onClose={() => {}}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("host-code-select"))).toBeEnabled();
    });

    fireEvent.keyDown(getByTestId("host-code-select"), { key: "ArrowDown" });
    const options = getAllByRole("option");

    const unmappedOptions = unmappedNativeHostsQueryOpts.pdNativeHosts!;
    const mappedOptions = mockUser.pdHostMappings!;
    expect(options).toHaveLength(unmappedOptions.length + mappedOptions.length);
  });

  it("sorts and displays correctly selected host code options", async () => {
    const { getByTestId, getAllByRole } = render(
      <ManageMappingDialog
        userId={"1"}
        siteId={"0"}
        onClose={() => {}}
        onSave={() => {}}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getInput(getByTestId("host-code-select"))).toBeEnabled();
    });

    fireEvent.keyDown(getByTestId("host-code-select"), { key: "ArrowDown" });
    const options = getAllByRole("option");

    const unmappedOptions = unmappedNativeHostsQueryOpts.pdNativeHosts!;
    const mappedOptions = mockUser.pdHostMappings!;
    // Dave
    expect(options[0]).toHaveTextContent(unmappedOptions[1].firstName);
    expect(getInput(options[0])).not.toBeChecked();
    // Jeff
    expect(options[1]).toHaveTextContent(unmappedOptions[0].firstName);
    expect(getInput(options[1])).not.toBeChecked();
    // Zach
    expect(options[2]).toHaveTextContent(mappedOptions[0].nativeHost!.firstName);
    expect(getInput(options[2])).toBeChecked();
  });

  it("runs onClose when the dialog header close button is clicked", () => {
    const onClose = jest.fn();
    const { getByRole } = render(
      <ManageMappingDialog
        userId={"1"}
        siteId={"0"}
        onClose={onClose}
        onSave={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("runs onSave when host mappings are updated successfully", async () => {
    const onSave = jest.fn();
    const mappedIds = mockUser.pdHostMappings!.map(
      ({ nativeHost }) => nativeHost!.nativeHostId
    );
    mappingUpdateOpts = { vars: { nativeHostIds: mappedIds } };
    const { getByText, queryByText, findByTestId } = render(
      <ManageMappingDialog
        userId={"1"}
        siteId={"0"}
        onClose={() => {}}
        onSave={onSave}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getByText("Save")).toBeEnabled();
    });
    fireEvent.click(getByText("Save"));

    expect(queryByText("Save")).not.toBeInTheDocument();
    expect(getByText("Saving")).toBeInTheDocument();

    const alert = await findByTestId("alert");
    expect(alert).toHaveTextContent("Changes saved");
    expect(onSave).toHaveBeenCalled();
  });

  it("doesn't run onSave if there is an error updating host mapping", async () => {
    const onSave = jest.fn();
    const mappedIds = mockUser.pdHostMappings!.map(
      ({ nativeHost }) => nativeHost!.nativeHostId
    );
    mappingUpdateOpts = {
      vars: { nativeHostIds: mappedIds },
      errors: [new GraphQLError("error")]
    };
    const { getByText, findByTestId } = render(
      <ManageMappingDialog
        userId={"1"}
        siteId={"0"}
        onClose={() => {}}
        onSave={onSave}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(getByText("Save")).toBeEnabled();
    });
    fireEvent.click(getByText("Save"));

    const alert = await findByTestId("alert");
    expect(alert).toHaveTextContent("An unexpected error");
    expect(onSave).not.toHaveBeenCalled();
  });
});
