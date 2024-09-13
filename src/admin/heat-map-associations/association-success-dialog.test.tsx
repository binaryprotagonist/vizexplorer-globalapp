import { fireEvent, render } from "@testing-library/react";
import { ThemeProvider } from "../../theme";
import { AssociationSuccessDialog } from "./association-success-dialog";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<AssociationSuccessDialog />", () => {
  it("renders", () => {
    const { getByTestId } = render(<AssociationSuccessDialog onClose={() => {}} />, {
      wrapper
    });

    expect(getByTestId("association-success-dialog")).toBeInTheDocument();
  });

  it("runs onClose when close button is clicked", () => {
    const onClose = jest.fn();
    const { getByTestId } = render(<AssociationSuccessDialog onClose={onClose} />, {
      wrapper
    });

    fireEvent.click(getByTestId("close-button"));
    expect(onClose).toHaveBeenCalled();
  });
});
