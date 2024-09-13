import { fireEvent, render } from "@testing-library/react";
import { NoPrograms } from "./no-programs";

describe("<NoPrograms />", () => {
  it("renders", () => {
    const { getByTestId } = render(<NoPrograms onClickAddNewProgram={() => {}} />);

    expect(getByTestId("no-programs")).toBeInTheDocument();
  });

  it("runs onClickAddNewProgram when Add program button is clicked", () => {
    const onClickAddNewProgram = jest.fn();
    const { getByText } = render(
      <NoPrograms onClickAddNewProgram={onClickAddNewProgram} />
    );

    fireEvent.click(getByText("Add program"));
    expect(onClickAddNewProgram).toHaveBeenCalled();
  });
});
