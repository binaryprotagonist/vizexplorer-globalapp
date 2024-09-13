import { act, fireEvent, render } from "@testing-library/react";
import { HeatMapInventoryFragment } from "generated-graphql";
import { ThemeProvider } from "../../theme";
import { AllHeatMapsTable } from "./all-heat-maps-table";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

const mockData: HeatMapInventoryFragment[] = [
  {
    id: "s3://maps/1612171522/fileZ.js",
    uploadedAt: "2021-02-01"
  },
  {
    id: "s3://maps/1614590722/fileA.js",
    uploadedAt: "2021-03-01"
  },
  {
    id: "s3://maps/1609493122/fileB.js",
    uploadedAt: "2021-01-01"
  }
];

describe("<AllHeatMapsTable />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <AllHeatMapsTable
        data={[]}
        loading={false}
        onClickSelect={() => {}}
        search={""}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("all-heat-maps-table")).toBeInTheDocument();
  });

  it("renders expected columns", () => {
    const { getByText } = render(
      <AllHeatMapsTable
        data={[]}
        loading={false}
        onClickSelect={() => {}}
        search={""}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    expect(getByText("File Name")).toBeInTheDocument();
    expect(getByText("Upload Date")).toBeInTheDocument();
  });

  it("sorts data by date desc", () => {
    const { getAllByTestId } = render(
      <AllHeatMapsTable
        data={mockData}
        loading={false}
        onClickSelect={() => {}}
        search={""}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    const rows = getAllByTestId("heatmap-row");
    expect(rows[0]).toHaveTextContent("fileA.js");
    expect(rows[0]).toHaveTextContent("Mon, Mar 1, 2021");
    expect(rows[1]).toHaveTextContent("fileZ.js");
    expect(rows[1]).toHaveTextContent("Mon, Feb 1, 2021");
    expect(rows[2]).toHaveTextContent("fileB.js");
    expect(rows[2]).toHaveTextContent("Fri, Jan 1, 2021");
  });

  it("can sort data by file name", () => {
    const { getByText, getAllByTestId } = render(
      <AllHeatMapsTable
        data={mockData}
        loading={false}
        onClickSelect={() => {}}
        search={""}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("File Name"));

    const rows = getAllByTestId("heatmap-row");
    expect(rows[0]).toHaveTextContent("fileZ.js");
    expect(rows[1]).toHaveTextContent("fileB.js");
    expect(rows[2]).toHaveTextContent("fileA.js");
  });

  it("renders expected actions", () => {
    const { getAllByText } = render(
      <AllHeatMapsTable
        data={mockData}
        loading={false}
        onClickSelect={() => {}}
        search={""}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    expect(getAllByText("Select")).toHaveLength(mockData.length);
  });

  it("runs `onSelect` when `Select` is clicked", () => {
    const onSelect = jest.fn();
    const { getAllByText } = render(
      <AllHeatMapsTable
        data={mockData}
        loading={false}
        onClickSelect={onSelect}
        search={""}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getAllByText("Select")[0]);
    const call = onSelect.mock.calls[0][0];
    expect(call.id).toEqual(mockData[1].id);
  });

  it("doesn't search on date", () => {
    // search is handled by `onSearchChange` callback instead of filtering rows
    const { getAllByTestId, getByPlaceholderText } = render(
      <AllHeatMapsTable
        data={mockData}
        loading={false}
        onClickSelect={() => {}}
        search={""}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    act(() => {
      const search = getByPlaceholderText("Search");
      fireEvent.change(search, { target: { value: "mar 1" } });
      jest.runAllTimers();
    });

    const rows = getAllByTestId("heatmap-row");
    expect(rows).toHaveLength(mockData.length);
  });

  it("doesn't search on file name", () => {
    // search is handled by `onSearchChange` callback instead of filtering rows
    const { getAllByTestId, getByPlaceholderText } = render(
      <AllHeatMapsTable
        data={mockData}
        loading={false}
        onClickSelect={() => {}}
        search={""}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    act(() => {
      const search = getByPlaceholderText("Search");
      fireEvent.change(search, { target: { value: "fileB" } });
      jest.runAllTimers();
    });

    const rows = getAllByTestId("heatmap-row");
    expect(rows).toHaveLength(mockData.length);
  });

  it("calls `onSearchChange` when search input changes", () => {
    const onSearchChange = jest.fn();
    const { getByPlaceholderText } = render(
      <AllHeatMapsTable
        data={mockData}
        loading={false}
        onClickSelect={() => {}}
        search={""}
        onSearchChange={onSearchChange}
      />,
      { wrapper }
    );

    act(() => {
      const search = getByPlaceholderText("Search");
      fireEvent.change(search, { target: { value: "test search" } });
      jest.runAllTimers();
    });

    expect(onSearchChange).toHaveBeenCalledWith("test search");
  });

  it("sets initial search value on mount", () => {
    const { getByPlaceholderText } = render(
      <AllHeatMapsTable
        data={mockData}
        loading={false}
        onClickSelect={() => {}}
        search={"some search value"}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    const search = getByPlaceholderText("Search");
    expect(search).toHaveValue("some search value");
  });

  it("doesn't update the search value when it changes", () => {
    const { rerender, getByPlaceholderText } = render(
      <AllHeatMapsTable
        data={mockData}
        loading={false}
        onClickSelect={() => {}}
        search={"some search value"}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    let search = getByPlaceholderText("Search");
    expect(search).toHaveValue("some search value");

    rerender(
      <AllHeatMapsTable
        data={mockData}
        loading={false}
        onClickSelect={() => {}}
        search={"another search value"}
        onSearchChange={() => {}}
      />
    );

    search = getByPlaceholderText("Search");
    expect(search).toHaveValue("some search value");
  });
});
