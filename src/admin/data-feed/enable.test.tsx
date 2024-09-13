import { fireEvent, render, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { Enable } from "./enable";
import { ThemeProvider } from "../../theme";
import { mockDataAdapterEnableMutation } from "../../view/testing/mocks/admin";

describe("<Enable />", () => {
  function wrapper({ children }: any) {
    return (
      <ThemeProvider>
        <MockedProvider mocks={[mockDataAdapterEnableMutation("1")]}>
          {children}
        </MockedProvider>
      </ThemeProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(
      <Enable disabled={false} onEnable={() => {}} loading={false} />,
      { wrapper }
    );

    expect(getByTestId("feed-enable")).toBeInTheDocument();
  });

  it("renders Enable button", () => {
    const { getByText } = render(
      <Enable disabled={false} onEnable={() => {}} loading={false} />,
      { wrapper }
    );

    expect(getByText("Enable Data Feed")).toBeInTheDocument();
  });

  it("disables Enable button if `disable` is true", () => {
    const { getByText } = render(
      <Enable disabled={true} onEnable={() => {}} loading={false} />,
      { wrapper }
    );

    expect(getByText("Enable Data Feed")).toBeDisabled();
  });

  it("enabled Enable button if `disable` is false", () => {
    const { getByText } = render(
      <Enable disabled={false} onEnable={() => {}} loading={false} />,
      { wrapper }
    );

    expect(getByText("Enable Data Feed")).toBeEnabled();
  });

  it("runs `onEnable` after processing enable request", async () => {
    const onEnable = jest.fn();
    const { getByText } = render(
      <Enable disabled={false} onEnable={onEnable} loading={false} />,
      { wrapper }
    );

    fireEvent.click(getByText("Enable Data Feed"));
    await waitFor(() => {
      expect(onEnable).toHaveBeenCalled();
    });
  });

  it("doesn't run `onEnable` prior to processing enable request", () => {
    const onEnable = jest.fn();
    const { getByText } = render(
      <Enable disabled={false} onEnable={onEnable} loading={false} />,
      { wrapper }
    );

    fireEvent.click(getByText("Enable Data Feed"));
    expect(onEnable).not.toHaveBeenCalled();
  });
});
