import { render } from "@testing-library/react";
import { ReleaseNotes } from "./release-notes";
import { ThemeProvider } from "../../theme";

const mockMarkupNotes = "# Heading 1\n- list item";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<ReleaseNotes />", () => {
  it("renders", () => {
    const { getByTestId } = render(<ReleaseNotes notes={""} />, { wrapper });

    expect(getByTestId("release-notes")).toBeInTheDocument();
  });

  it("renders markup release notes as html", () => {
    const { getByText } = render(<ReleaseNotes notes={mockMarkupNotes} />, {
      wrapper
    });

    expect(getByText("Heading 1").nodeName).toBe("H1");
    expect(getByText("list item").nodeName).toBe("LI");
  });
});
