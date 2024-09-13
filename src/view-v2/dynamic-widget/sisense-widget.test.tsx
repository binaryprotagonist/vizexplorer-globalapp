import { render } from "@testing-library/react";
import { SisenseDashboardContext, SisenseDashboardCtx } from "view-v2/sisense";
import { generateDummySisenseDashWrappers } from "view-v2/sisense/__mocks__/sisense";
import { SisenseWidget } from "./sisense-widget";

describe("<SisenseWidget />", () => {
  let sisenseDashboardCtx: SisenseDashboardCtx;

  beforeEach(() => {
    sisenseDashboardCtx = {
      dashboard: generateDummySisenseDashWrappers(1)[0],
      loaded: true,
      loading: false,
      error: null
    };
  });

  function wrapper({ children }: any) {
    return (
      <SisenseDashboardContext.Provider value={sisenseDashboardCtx}>
        {children}
      </SisenseDashboardContext.Provider>
    );
  }

  it("renders Sisense widget if loaded successfully", () => {
    const { getByTestId } = render(<SisenseWidget id={"widget-1"} title={"Widget 1"} />, {
      wrapper
    });

    expect(getByTestId("sisense-widget")).toBeInTheDocument();
  });

  it("renders loading widget if the dashboard isn't loaded yet", () => {
    sisenseDashboardCtx.loaded = false;
    const { getByTestId, queryByTestId } = render(
      <SisenseWidget id={"widget-1"} title={"Widget 1"} />,
      { wrapper }
    );

    expect(getByTestId("dynamic-widget-loading")).toBeInTheDocument();
    expect(queryByTestId("sisense-widget")).not.toBeInTheDocument();
  });

  it("renders loading widget if the dashboard is still loading", () => {
    sisenseDashboardCtx.loading = true;
    const { getByTestId, queryByTestId } = render(
      <SisenseWidget id={"widget-1"} title={"Widget 1"} />,
      { wrapper }
    );

    expect(getByTestId("dynamic-widget-loading")).toBeInTheDocument();
    expect(queryByTestId("sisense-widget")).not.toBeInTheDocument();
  });

  it("renders error widget if there is an error loading the dashboard", () => {
    sisenseDashboardCtx.error = new Error("Dashboard error");
    const { getByTestId, queryByTestId } = render(
      <SisenseWidget id={"widget-1"} title={"Widget 1"} />,
      { wrapper }
    );

    expect(getByTestId("dynamic-widget-error")).toBeInTheDocument();
    expect(queryByTestId("sisense-widget")).not.toBeInTheDocument();
  });

  it("renders missing widget if the widget is not found", () => {
    sisenseDashboardCtx.dashboard!.inner.widgets.get = jest.fn(() => null);
    const { getByTestId, queryByTestId } = render(
      <SisenseWidget id={"widget-1"} title={"Widget 1"} />,
      { wrapper }
    );

    expect(getByTestId("dynamic-widget-missing")).toBeInTheDocument();
    expect(queryByTestId("sisense-widget")).not.toBeInTheDocument();
  });
});
