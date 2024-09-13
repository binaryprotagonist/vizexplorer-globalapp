import { fireEvent, render } from "@testing-library/react";
import { ThemeProvider } from "../../../theme";
import { ManagedOptionsAutocomplete } from "./managed-options-autocomplete";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

const downArrow = { keyCode: 40 };

describe("<ManagedOptionsAutocomplete", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <ManagedOptionsAutocomplete
        data-testid={"managed-options-autocomplete"}
        options={[]}
        value={null}
        newOptionLabel={"Add New Thing"}
        onChange={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("managed-options-autocomplete")).toBeInTheDocument();
  });

  it("renders provided `label`", () => {
    const { getAllByText } = render(
      <ManagedOptionsAutocomplete
        label={"My Label"}
        options={[]}
        value={null}
        newOptionLabel={"Add New Thing"}
        onChange={() => {}}
      />,
      { wrapper }
    );

    expect(getAllByText("My Label")[0]).toBeInTheDocument();
  });

  it("renders `newOptionLabel` as part of `options`, even if `options` is empty", () => {
    const { getByTestId, getByText } = render(
      <ManagedOptionsAutocomplete
        data-testid={"managed-options-autocomplete"}
        options={[]}
        value={null}
        newOptionLabel={"Add New Thing"}
        onChange={() => {}}
      />,
      { wrapper }
    );

    fireEvent.keyDown(getByTestId("managed-options-autocomplete"), downArrow);
    expect(getByText("Add New Thing")).toBeInTheDocument();
  });

  it("renders `newOptionLabel` as part of `options` when options isn't empty", () => {
    const { getByTestId, getByText } = render(
      <ManagedOptionsAutocomplete
        data-testid={"managed-options-autocomplete"}
        options={["val 1"]}
        value={null}
        newOptionLabel={"Add New Thing"}
        onChange={() => {}}
      />,
      { wrapper }
    );

    fireEvent.keyDown(getByTestId("managed-options-autocomplete"), downArrow);
    expect(getByText("Add New Thing")).toBeInTheDocument();
  });

  it("can render `string` options", () => {
    const options = ["opt 1", "opt 2", "opt 3"];
    const { getByTestId, getByText } = render(
      <ManagedOptionsAutocomplete
        data-testid={"managed-options-autocomplete"}
        options={options}
        value={null}
        newOptionLabel={"Add New Thing"}
        onChange={() => {}}
      />,
      { wrapper }
    );

    fireEvent.keyDown(getByTestId("managed-options-autocomplete"), downArrow);
    options.forEach((opt) => {
      expect(getByText(opt)).toBeInTheDocument();
    });
  });

  it("can render `object` options", () => {
    const options = Array(3)
      .fill(null)
      .map((_, idx) => ({ id: idx, name: `obj ${idx}` }));
    const { getByTestId, getByText } = render(
      <ManagedOptionsAutocomplete
        data-testid={"managed-options-autocomplete"}
        options={options}
        value={null}
        newOptionLabel={"Add New Thing"}
        onChange={() => {}}
        getOptionLabel={(opt) => opt!.name}
        isOptionEqualToValue={(opt, value) => opt!.id === value!.id}
      />,
      { wrapper }
    );

    fireEvent.keyDown(getByTestId("managed-options-autocomplete"), downArrow);
    options.forEach((opt) => {
      expect(getByText(opt.name)).toBeInTheDocument();
    });
  });

  it("runs `onChange` with expected values when `newOptionLabel` option is clicked", () => {
    const onClick = jest.fn();
    const { getByTestId, getByText } = render(
      <ManagedOptionsAutocomplete
        data-testid={"managed-options-autocomplete"}
        options={[]}
        value={null}
        newOptionLabel={"Add New Thing"}
        onChange={onClick}
      />,
      { wrapper }
    );

    fireEvent.keyDown(getByTestId("managed-options-autocomplete"), downArrow);
    fireEvent.click(getByText("Add New Thing"));
    expect(onClick).toHaveBeenCalledWith({ type: "new" });
  });

  it("runs `onChange` with expected values when an option is clicked", () => {
    const onClick = jest.fn();
    const { getByTestId, getByText } = render(
      <ManagedOptionsAutocomplete
        data-testid={"managed-options-autocomplete"}
        options={["val 1"]}
        value={null}
        newOptionLabel={"Add New Thing"}
        onChange={onClick}
      />,
      { wrapper }
    );

    fireEvent.keyDown(getByTestId("managed-options-autocomplete"), downArrow);
    fireEvent.click(getByText("val 1"));
    expect(onClick).toHaveBeenCalledWith({ type: "change", value: "val 1" });
  });

  it("runs `onChange` with expected values when an `Edit` on an option is clicked", () => {
    const onClick = jest.fn();
    const { getByTestId, getByText } = render(
      <ManagedOptionsAutocomplete
        data-testid={"managed-options-autocomplete"}
        options={["val 1"]}
        value={null}
        newOptionLabel={"Add New Thing"}
        onChange={onClick}
      />,
      { wrapper }
    );

    fireEvent.keyDown(getByTestId("managed-options-autocomplete"), downArrow);
    fireEvent.click(getByText("Edit"));
    expect(onClick).toHaveBeenCalledWith({ type: "edit", value: "val 1" });
  });
});
