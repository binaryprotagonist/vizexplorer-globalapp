import { fireEvent, render, waitFor } from "@testing-library/react";
import { ThemeProvider } from "../../theme";
import { getInput, MockedProvider } from "../../view/testing";
import { MultifactorToggle } from "./multifactor-toggle";
import { mockOrgAdmin, mockUpdateMfa } from "../../view/testing/mocks";
import { InMemoryCache } from "@apollo/client";
import { cacheConfig } from "../../view/graphql";
import { GaUserFragment } from "generated-graphql";
import { act } from "react-dom/test-utils";

describe("<MultifactorToggle />", () => {
  const cache = new InMemoryCache(cacheConfig);
  const currentUser: GaUserFragment = { ...mockOrgAdmin, accessList: [], mfa: false };

  beforeEach(() => {
    cache.restore({});
  });

  function wrapper({ children }: any) {
    return (
      <MockedProvider
        cache={cache}
        mocks={[mockUpdateMfa({ user: currentUser, mfa: true })]}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </MockedProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(
      <MultifactorToggle currentUser={currentUser} enabled={false} />,
      { wrapper }
    );

    expect(getByTestId("multifactor-switch")).toBeInTheDocument();
    expect(getInput(getByTestId("multifactor-switch"))!.checked).toBeFalsy();
  });

  it("defaults switch state based on provided `enabled` value", () => {
    const { getByTestId } = render(
      <MultifactorToggle currentUser={currentUser} enabled={true} />,
      { wrapper }
    );

    expect(getInput(getByTestId("multifactor-switch"))!.checked).toBeTruthy();
  });

  it("updates switch state on click", () => {
    const { getByTestId, unmount } = render(
      <MultifactorToggle currentUser={currentUser} enabled={false} />,
      { wrapper }
    );

    act(() => {
      fireEvent.click(getInput(getByTestId("multifactor-switch"))!);
    });

    expect(getInput(getByTestId("multifactor-switch"))!.checked).toBeTruthy();
    unmount();
  });

  it("updates users mfa from `false` to `true`", async () => {
    const cacheId = cache.identify(currentUser)!;
    cache.restore({ [cacheId]: currentUser });
    const { getByTestId } = render(
      <MultifactorToggle currentUser={currentUser} enabled={false} />,
      { wrapper }
    );

    // @ts-ignore
    expect(cache.extract()[cacheId]).toEqual(currentUser);
    fireEvent.click(getInput(getByTestId("multifactor-switch"))!);
    act(() => {
      jest.useFakeTimers().advanceTimersByTime(500); // run timers for debounce
      jest.useRealTimers(); // change back to real timers to support `waitFor` promises
    });
    // wait for update mutation
    await waitFor(() => {
      // @ts-ignore
      expect(cache.extract()[cacheId]).toEqual({ ...currentUser, mfa: true });
    });
  });
});
