import { act, fireEvent, render } from "@testing-library/react";
import { OrgHeatMapFragment } from "generated-graphql";
import { ThemeProvider } from "../../theme";
import { AssociatedHeatMapsTable } from "./associated-heat-maps-table";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

const mockData: OrgHeatMapFragment[] = [
  {
    id: "ohm-1",
    effectiveFrom: "2021-02-01",
    floorId: "1",
    sourceSiteId: "site-1",
    heatMapId: "s3://maps/1612171522/fileZ.js"
  },
  {
    id: "ohm-2",
    effectiveFrom: "2021-03-01",
    floorId: "1",
    sourceSiteId: "site-1",
    heatMapId: "s3://maps/1614590722/fileA.js"
  },
  {
    id: "ohm-3",
    effectiveFrom: "2021-01-01",
    floorId: "1",
    sourceSiteId: "site-1",
    heatMapId: "s3://maps/1609493122/fileB.js"
  }
];

describe("<AssociatedHeatMapsTable />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <AssociatedHeatMapsTable
        data={[]}
        loading={false}
        onClickDelete={() => {}}
        search={""}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("associated-heat-maps-table")).toBeInTheDocument();
  });

  it("sorts data by effective date desc", () => {
    const { getAllByTestId } = render(
      <AssociatedHeatMapsTable
        data={mockData}
        loading={false}
        onClickDelete={() => {}}
        search={""}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    const rows = getAllByTestId("associated-heat-map-row");
    let [filename, effectiveDate, floorId] = rows[0].children;
    expect(filename).toHaveTextContent("fileA.js");
    expect(effectiveDate).toHaveTextContent("Mon, Mar 1, 2021");
    expect(floorId).toHaveTextContent("1");

    [filename, effectiveDate, floorId] = rows[1].children;
    expect(filename).toHaveTextContent("fileZ.js");
    expect(effectiveDate).toHaveTextContent("Mon, Feb 1, 2021");
    expect(floorId).toHaveTextContent("1");

    [filename, effectiveDate, floorId] = rows[2].children;
    expect(filename).toHaveTextContent("fileB.js");
    expect(effectiveDate).toHaveTextContent("Fri, Jan 1, 2021");
    expect(floorId).toHaveTextContent("1");
  });

  it("can sort data by file name", () => {
    const { getByText, getAllByTestId } = render(
      <AssociatedHeatMapsTable
        data={mockData}
        loading={false}
        onClickDelete={() => {}}
        search={""}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("File Name"));

    const rows = getAllByTestId("associated-heat-map-row");
    expect(rows[0]).toHaveTextContent("fileZ.js");
    expect(rows[1]).toHaveTextContent("fileB.js");
    expect(rows[2]).toHaveTextContent("fileA.js");
  });

  it("renders expected actions", () => {
    const { getAllByText } = render(
      <AssociatedHeatMapsTable
        data={mockData}
        loading={false}
        onClickDelete={() => {}}
        search={""}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    expect(getAllByText("Delete")).toHaveLength(mockData.length);
  });

  it("runs `onDelete` when `Delete` is clicked", () => {
    const onDelete = jest.fn();
    const { getAllByText } = render(
      <AssociatedHeatMapsTable
        data={mockData}
        loading={false}
        onClickDelete={onDelete}
        search={""}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getAllByText("Delete")[0]);
    const call = onDelete.mock.calls[0][0];
    expect(call.id).toEqual(mockData[1].id);
  });

  it("can search by effective date", () => {
    const { getAllByTestId, getByPlaceholderText } = render(
      <AssociatedHeatMapsTable
        data={mockData}
        loading={false}
        onClickDelete={() => {}}
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

    const rows = getAllByTestId("associated-heat-map-row");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent("fileA.js");
  });

  it("can search by file name", () => {
    const { getAllByTestId, getByPlaceholderText } = render(
      <AssociatedHeatMapsTable
        data={mockData}
        loading={false}
        onClickDelete={() => {}}
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

    const rows = getAllByTestId("associated-heat-map-row");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent("fileB.js");
  });

  it("can search on heatmap id", () => {
    const { getAllByTestId, getByPlaceholderText } = render(
      <AssociatedHeatMapsTable
        data={mockData}
        loading={false}
        onClickDelete={() => {}}
        search={""}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    act(() => {
      const search = getByPlaceholderText("Search");
      fireEvent.change(search, { target: { value: "maps/1612171522" } });
      jest.runAllTimers();
    });

    const rows = getAllByTestId("associated-heat-map-row");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent("fileZ.js");
  });

  it("runs `onSearchChange` when the search value changes", () => {
    const mockOnSearchChange = jest.fn();
    const { getByPlaceholderText } = render(
      <AssociatedHeatMapsTable
        data={mockData}
        loading={false}
        onClickDelete={() => {}}
        search={""}
        onSearchChange={mockOnSearchChange}
      />,
      { wrapper }
    );

    act(() => {
      const search = getByPlaceholderText("Search");
      fireEvent.change(search, { target: { value: "test" } });
      jest.runAllTimers();
    });

    expect(mockOnSearchChange).toHaveBeenCalledWith("test");
  });

  it("doesn't update the search value when it changes", () => {
    const { rerender, getByPlaceholderText } = render(
      <AssociatedHeatMapsTable
        data={mockData}
        loading={false}
        onClickDelete={() => {}}
        search={"some search value"}
        onSearchChange={() => {}}
      />,
      { wrapper }
    );

    let search = getByPlaceholderText("Search");
    expect(search).toHaveValue("some search value");

    rerender(
      <AssociatedHeatMapsTable
        data={mockData}
        loading={false}
        onClickDelete={() => {}}
        search={"another search value"}
        onSearchChange={() => {}}
      />
    );

    search = getByPlaceholderText("Search");
    expect(search).toHaveValue("some search value");
  });
});
