import { fireEvent, render } from "@testing-library/react";
import { AssociationToggle } from "./association-toggle";

describe("<AssociationToggle />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <AssociationToggle value={"all"} onChange={() => {}} />
    );

    expect(getByTestId("association-toggle")).toBeInTheDocument();
  });

  it("selects `all` of all is provided", () => {
    const { getByText } = render(<AssociationToggle value={"all"} onChange={() => {}} />);

    expect(getByText("All files")).toHaveAttribute("aria-pressed", "true");
    expect(getByText("Associated")).toHaveAttribute("aria-pressed", "false");
  });

  it("selected `Associated` if associated is provided", () => {
    const { getByText } = render(
      <AssociationToggle value={"associated"} onChange={() => {}} />
    );

    expect(getByText("All files")).toHaveAttribute("aria-pressed", "false");
    expect(getByText("Associated")).toHaveAttribute("aria-pressed", "true");
  });

  it("runs `onChange` when `All files` is clicked", () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <AssociationToggle value={"associated"} onChange={onChange} />
    );

    fireEvent.click(getByText("All files"));
    expect(onChange).toHaveBeenCalledWith("all");
  });

  it("runs `onChange` when `Associated` is clicked", () => {
    const onChange = jest.fn();
    const { getByText } = render(<AssociationToggle value={"all"} onChange={onChange} />);

    fireEvent.click(getByText("Associated"));
    expect(onChange).toHaveBeenCalledWith("associated");
  });

  it("doesn't run `onChange` when `All files` is clicked if `all` is selected", () => {
    const onChange = jest.fn();
    const { getByText } = render(<AssociationToggle value={"all"} onChange={onChange} />);

    fireEvent.click(getByText("All files"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("doesn't run `onChange` when `Associated` is clicked if `associated` is selected", () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <AssociationToggle value={"associated"} onChange={onChange} />
    );

    fireEvent.click(getByText("Associated"));
    expect(onChange).not.toHaveBeenCalled();
  });
});
