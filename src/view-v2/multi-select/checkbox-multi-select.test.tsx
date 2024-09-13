import { fireEvent, render } from "@testing-library/react";
import { CheckboxMultiSelect } from "./checkbox-multi-select";

describe("<CheckboxMultiSelect />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <CheckboxMultiSelect
        data-testid={"multi-select"}
        value={[]}
        options={[]}
        onChange={() => {}}
        icon={<span />}
      />
    );

    expect(getByTestId("multi-select")).toBeInTheDocument();
  });

  it("displays no options text if no options are provided", () => {
    const { getByTestId, getByText } = render(
      <CheckboxMultiSelect
        data-testid={"multi-select"}
        value={[]}
        options={[]}
        onChange={() => {}}
        icon={<span />}
      />
    );

    fireEvent.keyDown(getByTestId("multi-select"), { keyCode: 40 });

    expect(getByText("No options")).toBeInTheDocument();
  });

  it("renders expected options if options are provided", () => {
    const { getByTestId, getByText } = render(
      <CheckboxMultiSelect
        showSelectAll
        data-testid={"multi-select"}
        value={[]}
        options={["option1", "option2"]}
        onChange={() => {}}
        icon={<span />}
      />
    );

    fireEvent.keyDown(getByTestId("multi-select"), { keyCode: 40 });

    expect(getByText("All")).toBeInTheDocument();
    expect(getByText("option1")).toBeInTheDocument();
    expect(getByText("option2")).toBeInTheDocument();
  });

  it("can customize option labels", () => {
    const { getByTestId, getByText } = render(
      <CheckboxMultiSelect
        showSelectAll
        data-testid={"multi-select"}
        value={[]}
        options={["option1", "option2"]}
        onChange={() => {}}
        allOptionLabel={"Select all"}
        icon={<span />}
        getOptionLabel={(option) => option.toUpperCase()}
      />
    );

    fireEvent.keyDown(getByTestId("multi-select"), { keyCode: 40 });

    expect(getByText("Select all")).toBeInTheDocument();
    expect(getByText("OPTION1")).toBeInTheDocument();
    expect(getByText("OPTION2")).toBeInTheDocument();
  });

  it("runs onChange with expected value when a provided option is clicked", () => {
    const onChange = jest.fn();
    const { getByTestId, getByText } = render(
      <CheckboxMultiSelect
        data-testid={"multi-select"}
        value={[]}
        options={["option1", "option2"]}
        onChange={onChange}
        icon={<span />}
      />
    );

    fireEvent.keyDown(getByTestId("multi-select"), { keyCode: 40 });
    fireEvent.click(getByText("option1"));

    expect(onChange).toHaveBeenCalledWith(["option1"]);
  });

  it("runs onChange with expected value when the select all option is clicked", () => {
    const onChange = jest.fn();
    const { getByTestId, getByText } = render(
      <CheckboxMultiSelect
        showSelectAll
        data-testid={"multi-select"}
        value={[]}
        options={["option1", "option2"]}
        onChange={onChange}
        icon={<span />}
      />
    );

    fireEvent.keyDown(getByTestId("multi-select"), { keyCode: 40 });
    fireEvent.click(getByText("All"));

    expect(onChange).toHaveBeenCalledWith(["option1", "option2"]);
  });

  it("runs onChange with expected value when all options are selected individually", () => {
    const onChange = jest.fn();
    const { getByTestId, getByText } = render(
      <CheckboxMultiSelect
        data-testid={"multi-select"}
        value={["option1"]}
        options={["option1", "option2"]}
        onChange={onChange}
        icon={<span />}
      />
    );

    fireEvent.keyDown(getByTestId("multi-select"), { keyCode: 40 });
    fireEvent.click(getByText("option2"));

    expect(onChange).toHaveBeenCalledWith(["option1", "option2"]);
  });
});
