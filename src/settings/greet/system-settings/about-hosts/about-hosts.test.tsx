import { fireEvent, render } from "@testing-library/react";
import { AboutHosts } from "./about-hosts";
import { mockGreetSettings } from "testing/mocks";
import { AboutHostsChangeParams } from "./types";

describe("<AboutGuests />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <AboutHosts settingIds={[]} settingData={mockGreetSettings} onChange={() => {}} />
    );

    expect(getByTestId("about-hosts")).toBeInTheDocument();
  });

  it("renders greet assignment section if settingIds contains enable-section-for-greet", () => {
    const { getByTestId } = render(
      <AboutHosts
        settingIds={["enable-section-for-greet"]}
        settingData={mockGreetSettings}
        onChange={() => {}}
      />
    );

    expect(getByTestId("enable-section-for-greet")).toBeInTheDocument();
  });

  it("renders greet assignment section if settingIds contains allow-suppression-without-completion", () => {
    const { getByTestId } = render(
      <AboutHosts
        settingIds={["allow-suppression-without-completion"]}
        settingData={mockGreetSettings}
        onChange={() => {}}
      />
    );

    expect(getByTestId("allow-suppression-without-completion")).toBeInTheDocument();
  });

  it("renders greet assignment section if settingIds contains max-assignment-per-host", () => {
    const { getByTestId } = render(
      <AboutHosts
        settingIds={["max-assignment-per-host"]}
        settingData={mockGreetSettings}
        onChange={() => {}}
      />
    );

    expect(getByTestId("max-assignment-per-host")).toBeInTheDocument();
  });

  it("renders greet assignment section if settingIds contains enable-section-for-greet", () => {
    const { getByTestId } = render(
      <AboutHosts
        settingIds={["max-missed-greets"]}
        settingData={mockGreetSettings}
        onChange={() => {}}
      />
    );

    expect(getByTestId("max-missed-greets")).toBeInTheDocument();
  });

  it("doesn't render section if settingIds doesn't contain any id", () => {
    const { queryByTestId } = render(
      <AboutHosts settingIds={[]} settingData={mockGreetSettings} onChange={() => {}} />
    );
    expect(queryByTestId("enable-section-for-greet")).not.toBeInTheDocument();
    expect(queryByTestId("allow-suppression-without-completion")).not.toBeInTheDocument();
    expect(queryByTestId("max-assignment-per-host")).not.toBeInTheDocument();
    expect(queryByTestId("max-missed-greets")).not.toBeInTheDocument();
  });

  describe("MaxAssignmentsPerHost", () => {
    it("runs `onChange` if the number of assignments is changed", () => {
      const onChange = jest.fn();
      const { getByTestId, getByText } = render(
        <AboutHosts
          settingIds={["max-assignment-per-host"]}
          settingData={mockGreetSettings}
          onChange={onChange}
        />
      );

      fireEvent.click(getByTestId("max-assignments-per-host-action"));
      fireEvent.click(getByText("2 greets"));

      expect(onChange).toHaveBeenCalledWith<[AboutHostsChangeParams]>({
        settingId: "max-assignment-per-host",
        value: 2
      });
    });
  });

  describe("MaxMissedGreets", () => {
    it("runs `onChange` if the number of max greets is changed", () => {
      const onChange = jest.fn();
      const { getByTestId, getByText } = render(
        <AboutHosts
          settingIds={["max-missed-greets"]}
          settingData={mockGreetSettings}
          onChange={onChange}
        />
      );

      fireEvent.click(getByTestId("max-missed-greets-action"));
      fireEvent.click(getByText("2 greets"));

      expect(onChange).toHaveBeenCalledWith<[AboutHostsChangeParams]>({
        settingId: "max-missed-greets",
        value: 2
      });
    });
  });
});
