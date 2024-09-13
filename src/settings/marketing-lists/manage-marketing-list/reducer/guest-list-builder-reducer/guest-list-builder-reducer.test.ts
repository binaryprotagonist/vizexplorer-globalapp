import { renderHook } from "@testing-library/react";
import {
  CriteriaFilterGroup,
  GuestListBuilderReducerAction,
  GuestListBuilderReducerState
} from "./types";
import { useImmerReducer } from "use-immer";
import { act } from "react-dom/test-utils";
import { emptyGuestListBuilderReducerState } from "./utils";
import { guestListBuilderReducer } from "./guest-list-builder-reducer";
import {
  mockActualWinMetric,
  mockGFVChurnMetric,
  mockGFVTheoWinMetric,
  mockTheoWinMetric
} from "../../__mocks__/marketing-list-create";
import { produce } from "immer";
import {
  mockCustomDateRange,
  mockFuture180DaysDateRange,
  mockGFVChurnCriteriaFilter,
  mockGFVChurnFilterGroup,
  mockPast180DaysDateRange,
  mockTheoWinCriteriaFilter,
  mockTheoWinFilterGroup
} from "./__mocks__/guest-list-builder-reducer";
import { PdMetricDateRangeType } from "generated-graphql";

const mockState: GuestListBuilderReducerState = emptyGuestListBuilderReducerState();

function renderReducer(state: GuestListBuilderReducerState) {
  return renderHook(() =>
    useImmerReducer<GuestListBuilderReducerState, GuestListBuilderReducerAction>(
      guestListBuilderReducer,
      state
    )
  );
}

describe("manageMarketingListReducer", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("can update guest list builder type", () => {
    const { result } = renderReducer(mockState);
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-type", payload: { type: "raw-string" } });
    });

    const [newState] = result.current;
    expect(curState.builder.type).toEqual("criteria");
    expect(newState.builder.type).toEqual("raw-string");
  });

  it("can update hosted", () => {
    const { result } = renderReducer(mockState);
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-hosted", payload: { hosted: false } });
    });

    const [newState] = result.current;
    expect(curState.builder.criteria.hosted).toEqual(true);
    expect(newState.builder.criteria.hosted).toEqual(false);
  });

  it("can reset filter groups", () => {
    const withFilterGroups = produce(mockState, (draft) => {
      draft.builder.criteria.filterGroups = [
        {
          filters: [mockTheoWinCriteriaFilter, mockGFVChurnCriteriaFilter],
          canAddFilter: false
        },
        {
          filters: [{ metric: mockGFVTheoWinMetric, range: ["10", null] }],
          canAddFilter: false
        }
      ];
    });
    const { result } = renderReducer(withFilterGroups);
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "reset-filter-groups" });
    });

    const [newState] = result.current;
    expect(curState.builder.criteria.filterGroups).toHaveLength(2);
    expect(newState.builder.criteria.filterGroups).toEqual<CriteriaFilterGroup[]>([
      { filters: [{ metric: null }], canAddFilter: false }
    ]);
  });

  describe("update-filter-metric", () => {
    it("can update filter metric", () => {
      const { result } = renderReducer(mockState);
      const [curState, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-metric",
          payload: { groupIdx: 0, filterIdx: 0, metric: mockTheoWinMetric }
        });
      });

      const [newState] = result.current;
      const curFilter = curState.builder.criteria.filterGroups[0].filters[0];
      const newFilter = newState.builder.criteria.filterGroups[0].filters[0];
      expect(curFilter.metric).toEqual(null);
      expect(newFilter.metric).toEqual(mockTheoWinMetric);
    });

    it("retains the filters values if the date range type matches", () => {
      const completeFilter = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters[0] = mockTheoWinCriteriaFilter;
      });
      const { result } = renderReducer(completeFilter);
      const [curState, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-metric",
          payload: { groupIdx: 0, filterIdx: 0, metric: mockActualWinMetric }
        });
      });

      const [newState] = result.current;
      const curFilter = curState.builder.criteria.filterGroups[0].filters[0];
      const newFilter = newState.builder.criteria.filterGroups[0].filters[0];
      expect(curFilter.metric).toEqual(mockTheoWinMetric);
      expect(newFilter.metric).toEqual(mockActualWinMetric);
      expect(newFilter.dateRange).toEqual(mockTheoWinCriteriaFilter.dateRange);
      expect(newFilter.range).toEqual(mockTheoWinCriteriaFilter.range);
    });

    it("resets the filter values if the date range type does not match", () => {
      const completeFilter = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters[0] = mockTheoWinCriteriaFilter;
      });
      const { result } = renderReducer(completeFilter);
      const [curState, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-metric",
          payload: { groupIdx: 0, filterIdx: 0, metric: mockGFVTheoWinMetric }
        });
      });

      const [newState] = result.current;
      const curFilter = curState.builder.criteria.filterGroups[0].filters[0];
      const newFilter = newState.builder.criteria.filterGroups[0].filters[0];
      expect(curFilter.metric).toEqual(mockTheoWinMetric);
      expect(newFilter.metric).toEqual(mockGFVTheoWinMetric);
      expect(newFilter.dateRange).toBeUndefined();
      expect(newFilter.range).toBeUndefined();
    });

    it("console errors if the filter group index does not exist", () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      const { result } = renderReducer(mockState);
      const [, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-metric",
          payload: { groupIdx: 1, filterIdx: 0, metric: mockTheoWinMetric }
        });
      });

      const [newState] = result.current;
      const newFilter = newState.builder.criteria.filterGroups[0].filters[0];
      expect(newFilter.metric).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        expect.stringMatching(/filter group index/i)
      );
    });

    it("console errors if the filter index does not exist", () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      const { result } = renderReducer(mockState);
      const [, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-metric",
          payload: { groupIdx: 0, filterIdx: 1, metric: mockTheoWinMetric }
        });
      });

      const [newState] = result.current;
      const newFilter = newState.builder.criteria.filterGroups[0].filters[0];
      expect(newFilter.metric).toBeNull();
      expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/filter index/i));
    });
  });

  describe("update-filter-date-range", () => {
    it("can update a past metric filter date range with a preset value", () => {
      const withSelectedMetric = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters[0].metric = mockTheoWinMetric;
      });
      const { result } = renderReducer(withSelectedMetric);
      const [curState, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-date-range",
          payload: { groupIdx: 0, filterIdx: 0, dateRange: mockPast180DaysDateRange }
        });
      });

      const [newState] = result.current;
      const curFilter = curState.builder.criteria.filterGroups[0].filters[0];
      const newFilter = newState.builder.criteria.filterGroups[0].filters[0];
      expect(curFilter.dateRange).toBeUndefined();
      expect(newFilter.dateRange).toEqual(mockPast180DaysDateRange);
    });

    it("can update a past metric filter date range with a custom value", () => {
      const withSelectedMetric = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters[0].metric = mockTheoWinMetric;
      });
      const { result } = renderReducer(withSelectedMetric);
      const [curState, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-date-range",
          payload: {
            groupIdx: 0,
            filterIdx: 0,
            dateRange: mockCustomDateRange
          }
        });
      });

      const [newState] = result.current;
      const curFilter = curState.builder.criteria.filterGroups[0].filters[0];
      const newFilter = newState.builder.criteria.filterGroups[0].filters[0];
      expect(curFilter.dateRange).toBeUndefined();
      expect(newFilter.dateRange).toEqual(mockCustomDateRange);
    });

    it("can update a custom date range without specifying a start or end date", () => {
      const withSelectedMetric = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters[0].metric = mockTheoWinMetric;
      });
      const { result } = renderReducer(withSelectedMetric);
      const [curState, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-date-range",
          payload: {
            groupIdx: 0,
            filterIdx: 0,
            dateRange: {
              type: PdMetricDateRangeType.PastPreset,
              value: { custom: { start: null, end: null } }
            }
          }
        });
      });

      const [newState] = result.current;
      const curFilter = curState.builder.criteria.filterGroups[0].filters[0];
      const newFilter = newState.builder.criteria.filterGroups[0].filters[0];
      expect(curFilter.dateRange).toBeUndefined();
      expect(newFilter.dateRange).toEqual({
        type: PdMetricDateRangeType.PastPreset,
        value: { custom: { start: null, end: null } }
      });
    });

    it("can update a future metric filter date range with a preset value", () => {
      const withSelectedMetric = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters[0].metric = mockGFVTheoWinMetric;
      });
      const { result } = renderReducer(withSelectedMetric);
      const [curState, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-date-range",
          payload: { groupIdx: 0, filterIdx: 0, dateRange: mockFuture180DaysDateRange }
        });
      });

      const [newState] = result.current;
      const curFilter = curState.builder.criteria.filterGroups[0].filters[0];
      const newFilter = newState.builder.criteria.filterGroups[0].filters[0];
      expect(curFilter.dateRange).toBeUndefined();
      expect(newFilter.dateRange).toEqual(mockFuture180DaysDateRange);
    });

    it("console errors if the filter group index does not exist", () => {
      const withSelectedMetric = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters[0].metric = mockTheoWinMetric;
      });
      jest.spyOn(console, "error").mockImplementation(() => {});
      const { result } = renderReducer(withSelectedMetric);
      const [, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-date-range",
          payload: { groupIdx: 1, filterIdx: 0, dateRange: mockPast180DaysDateRange }
        });
      });

      const [newState] = result.current;
      const newFilter = newState.builder.criteria.filterGroups[0].filters[0];
      expect(newFilter.dateRange).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith(
        expect.stringMatching(/filter group index/i)
      );
    });

    it("console errors if the filter index does not exist", () => {
      const withSelectedMetric = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters[0].metric = mockTheoWinMetric;
      });
      jest.spyOn(console, "error").mockImplementation(() => {});
      const { result } = renderReducer(withSelectedMetric);
      const [, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-date-range",
          payload: { groupIdx: 0, filterIdx: 1, dateRange: mockPast180DaysDateRange }
        });
      });

      const [newState] = result.current;
      const newFilter = newState.builder.criteria.filterGroups[0].filters[0];
      expect(newFilter.dateRange).toBeUndefined();
      // regex matches "filter index" case insensitive and any characters after
      expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/filter index/i));
    });

    it("console errors if a Future date range is selected for a Past metric", () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      const withSelectedMetric = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters[0].metric = mockTheoWinMetric;
      });
      const { result } = renderReducer(withSelectedMetric);
      const [, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-date-range",
          payload: { groupIdx: 0, filterIdx: 0, dateRange: mockFuture180DaysDateRange }
        });
      });

      const [newState] = result.current;
      const newFilter = newState.builder.criteria.filterGroups[0].filters[0];
      expect(newFilter.dateRange).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith(
        expect.stringMatching(/doesn't accept a FUTURE_PRESET date range/i)
      );
    });

    it("console errors if a Past date range is selected for a Future metric", () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      const withSelectedMetric = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters[0].metric = mockGFVTheoWinMetric;
      });
      const { result } = renderReducer(withSelectedMetric);
      const [, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-date-range",
          payload: { groupIdx: 0, filterIdx: 0, dateRange: mockPast180DaysDateRange }
        });
      });

      const [newState] = result.current;
      const newFilter = newState.builder.criteria.filterGroups[0].filters[0];
      expect(newFilter.dateRange).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith(
        expect.stringMatching(/doesn't accept a PAST_PRESET date range/i)
      );
    });

    it("console errors if a custom date range is selected for a Future metric", () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      const withSelectedMetric = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters[0].metric = mockGFVTheoWinMetric;
      });
      const { result } = renderReducer(withSelectedMetric);
      const [, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-date-range",
          payload: {
            groupIdx: 0,
            filterIdx: 0,
            dateRange: {
              type: PdMetricDateRangeType.PastPreset,
              value: { custom: { start: null, end: null } }
            }
          }
        });
      });

      const [newState] = result.current;
      const newFilter = newState.builder.criteria.filterGroups[0].filters[0];
      expect(newFilter.dateRange).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith(
        expect.stringMatching(/doesn't accept a PAST_PRESET date range/i)
      );
    });

    it("console errors if the metric doesn't support a date range", () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      const withSelectedMetric = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters[0].metric = mockGFVChurnMetric;
      });
      const { result } = renderReducer(withSelectedMetric);
      const [, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-date-range",
          payload: { groupIdx: 0, filterIdx: 0, dateRange: mockPast180DaysDateRange }
        });
      });

      const [newState] = result.current;
      const newFilter = newState.builder.criteria.filterGroups[0].filters[0];
      expect(newFilter.dateRange).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith(
        expect.stringMatching(/doesn't accept a date range/i)
      );
    });
  });

  describe("update-filter-value", () => {
    it("can update a filter value range", () => {
      const withSelectedMetric = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters[0].metric = mockTheoWinMetric;
      });
      const { result } = renderReducer(withSelectedMetric);
      const [curState, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-value",
          payload: { groupIdx: 0, filterIdx: 0, value: { range: ["10", null] } }
        });
      });

      const [newState] = result.current;
      const curFilter = curState.builder.criteria.filterGroups[0].filters[0];
      const newFilter = newState.builder.criteria.filterGroups[0].filters[0];
      expect(curFilter.range).toBeUndefined();
      expect(newFilter.range).toEqual(["10", null]);
    });

    it("can update a filter value range with null values", () => {
      const withSelectedMetric = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters[0].metric = mockTheoWinMetric;
      });
      const { result } = renderReducer(withSelectedMetric);
      const [curState, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-value",
          payload: { groupIdx: 0, filterIdx: 0, value: { range: [null, null] } }
        });
      });

      const [newState] = result.current;
      const curFilter = curState.builder.criteria.filterGroups[0].filters[0];
      const newFilter = newState.builder.criteria.filterGroups[0].filters[0];
      expect(curFilter.range).toBeUndefined();
      expect(newFilter.range).toEqual([null, null]);
    });

    it("console errors if the filter group index does not exist", () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      const withSelectedMetric = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters[0].metric = mockTheoWinMetric;
      });
      const { result } = renderReducer(withSelectedMetric);
      const [, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-value",
          payload: { groupIdx: 1, filterIdx: 0, value: { range: ["10", null] } }
        });
      });

      const [newState] = result.current;
      const newFilter = newState.builder.criteria.filterGroups[0].filters[0];
      expect(newFilter.range).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith(
        expect.stringMatching(/filter group index/i)
      );
    });

    it("console errors if the filter index does not exist", () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      const withSelectedMetric = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters[0].metric = mockTheoWinMetric;
      });
      const { result } = renderReducer(withSelectedMetric);
      const [, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-value",
          payload: { groupIdx: 0, filterIdx: 1, value: { range: ["10", null] } }
        });
      });

      const [newState] = result.current;
      const newFilter = newState.builder.criteria.filterGroups[0].filters[0];
      expect(newFilter.range).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/filter index/i));
    });
  });

  describe("add-filter", () => {
    it("can add a new filter to a group", () => {
      const withCanAddFilter = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].canAddFilter = true;
      });
      const { result } = renderReducer(withCanAddFilter);
      const [curState, dispatch] = result.current;

      act(() => {
        dispatch({ type: "add-filter", payload: { groupIdx: 0 } });
      });

      const [newState] = result.current;
      expect(curState.builder.criteria.filterGroups[0].filters).toHaveLength(1);
      expect(newState.builder.criteria.filterGroups[0].filters).toHaveLength(2);
      expect(newState.builder.criteria.filterGroups[0].filters[1]).toEqual({
        metric: null
      });
    });

    it("console errors if the filter group index does not exist", () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      const { result } = renderReducer(mockState);
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "add-filter", payload: { groupIdx: 1 } });
      });

      const [newState] = result.current;
      expect(newState.builder.criteria.filterGroups[0].filters).toHaveLength(1);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringMatching(/filter group index/i)
      );
    });

    it("console errors if canAddFilter is false", () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      const { result } = renderReducer(mockState);
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "add-filter", payload: { groupIdx: 0 } });
      });

      const [newState] = result.current;
      expect(newState.builder.criteria.filterGroups[0].filters).toHaveLength(1);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringMatching(/requirements not met/i)
      );
    });
  });

  describe("delete-filter", () => {
    it("can delete a filter from a group", () => {
      const withMultipleFilters = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters = [
          mockTheoWinCriteriaFilter,
          mockGFVChurnCriteriaFilter
        ];
      });
      const { result } = renderReducer(withMultipleFilters);
      const [curState, dispatch] = result.current;

      act(() => {
        dispatch({ type: "delete-filter", payload: { groupIdx: 0, filterIdx: 0 } });
      });

      const [newState] = result.current;
      expect(curState.builder.criteria.filterGroups[0].filters).toHaveLength(2);
      expect(newState.builder.criteria.filterGroups[0].filters).toHaveLength(1);
      expect(newState.builder.criteria.filterGroups[0].filters[0]).toEqual(
        mockGFVChurnCriteriaFilter
      );
      expect(newState.builder.criteria.filterGroups[0].canAddFilter).toBe(true);
    });

    it("resets the filter if it is the last filter in the only group", () => {
      const withSingleFilter = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters = [mockTheoWinCriteriaFilter];
      });
      const { result } = renderReducer(withSingleFilter);
      const [curState, dispatch] = result.current;

      act(() => {
        dispatch({ type: "delete-filter", payload: { groupIdx: 0, filterIdx: 0 } });
      });

      const [newState] = result.current;
      expect(curState.builder.criteria.filterGroups[0].filters).toHaveLength(1);
      expect(newState.builder.criteria.filterGroups[0].filters).toHaveLength(1);
      expect(newState.builder.criteria.filterGroups[0].filters[0]).toEqual({
        metric: null
      });
      expect(newState.builder.criteria.filterGroups[0].canAddFilter).toBe(false);
    });

    it("removes the filter group if it is the last filter and there are multiple groups", () => {
      const withTwoFilterGroups = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups = [
          mockTheoWinFilterGroup,
          mockGFVChurnFilterGroup
        ];
      });
      const { result } = renderReducer(withTwoFilterGroups);
      const [curState, dispatch] = result.current;

      act(() => {
        dispatch({ type: "delete-filter", payload: { groupIdx: 0, filterIdx: 0 } });
      });

      const [newState] = result.current;
      expect(curState.builder.criteria.filterGroups).toHaveLength(2);
      expect(newState.builder.criteria.filterGroups).toHaveLength(1);
      expect(newState.builder.criteria.filterGroups[0].filters[0]).toEqual(
        mockGFVChurnCriteriaFilter
      );
      expect(newState.builder.criteria.canAddFilterGroup).toBe(true);
      expect(newState.builder.criteria.filterGroups[0].canAddFilter).toBe(true);
    });

    it("console errors if the filter group index does not exist", () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      const { result } = renderReducer(mockState);
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "delete-filter", payload: { groupIdx: 1, filterIdx: 0 } });
      });

      const [newState] = result.current;
      expect(newState.builder.criteria.filterGroups[0].filters).toHaveLength(1);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringMatching(/filter group index/i)
      );
    });

    it("console errors if the filter index does not exist", () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      const { result } = renderReducer(mockState);
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "delete-filter", payload: { groupIdx: 0, filterIdx: 1 } });
      });

      const [newState] = result.current;
      expect(newState.builder.criteria.filterGroups[0].filters).toHaveLength(1);
      expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/filter index/i));
    });
  });

  describe("add-filter-group", () => {
    it("can add a new filter group", () => {
      const withCanAddFilterGroup = produce(mockState, (draft) => {
        draft.builder.criteria.canAddFilterGroup = true;
      });
      const { result } = renderReducer(withCanAddFilterGroup);
      const [curState, dispatch] = result.current;

      act(() => {
        dispatch({ type: "add-filter-group" });
      });

      const [newState] = result.current;
      expect(curState.builder.criteria.filterGroups).toHaveLength(1);
      expect(newState.builder.criteria.filterGroups).toHaveLength(2);
      expect(newState.builder.criteria.filterGroups[1]).toEqual({
        filters: [{ metric: null }],
        canAddFilter: false
      });
    });

    it("console errors if canAddFilterGroup is false", () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      const { result } = renderReducer(mockState);
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "add-filter-group" });
      });

      const [newState] = result.current;
      expect(newState.builder.criteria.filterGroups).toHaveLength(1);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringMatching(/requirements not met/i)
      );
    });
  });

  describe("canAddFilterGroup", () => {
    it("is updated to true when all filters in a group are complete", () => {
      const withCompleteFilterGroup = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters[0] = mockTheoWinCriteriaFilter;
        draft.builder.criteria.filterGroups[0].canAddFilter = true;
      });
      const { result } = renderReducer(withCompleteFilterGroup);
      const [, dispatch] = result.current;

      act(() => {
        dispatch({ type: "add-filter", payload: { groupIdx: 0 } });
      });

      expect(result.current[0].builder.criteria.canAddFilterGroup).toBe(false);

      act(() => {
        dispatch({
          type: "update-filter-metric",
          payload: { groupIdx: 0, filterIdx: 1, metric: mockActualWinMetric }
        });
      });

      expect(result.current[0].builder.criteria.canAddFilterGroup).toBe(false);

      act(() => {
        dispatch({
          type: "update-filter-date-range",
          payload: { groupIdx: 0, filterIdx: 1, dateRange: mockPast180DaysDateRange }
        });
      });

      expect(result.current[0].builder.criteria.canAddFilterGroup).toBe(false);

      act(() => {
        dispatch({
          type: "update-filter-value",
          payload: { groupIdx: 0, filterIdx: 1, value: { range: ["10", null] } }
        });
      });

      expect(result.current[0].builder.criteria.canAddFilterGroup).toBe(true);
    });

    it("is updated to false if a filter group is changed to no longer be complete", () => {
      const withCompleteFilterGroup = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters[0] = mockTheoWinCriteriaFilter;
        draft.builder.criteria.canAddFilterGroup = true;
      });
      const { result } = renderReducer(withCompleteFilterGroup);
      const [, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-value",
          payload: { groupIdx: 0, filterIdx: 0, value: { range: [null, null] } }
        });
      });

      expect(result.current[0].builder.criteria.canAddFilterGroup).toBe(false);
    });
  });

  describe("canAddFilter", () => {
    it("is updated to true when a value range metric is complete", () => {
      const { result } = renderReducer(mockState);
      const [, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-metric",
          payload: { groupIdx: 0, filterIdx: 0, metric: mockTheoWinMetric }
        });
      });

      expect(result.current[0].builder.criteria.filterGroups[0].canAddFilter).toBe(false);

      act(() => {
        dispatch({
          type: "update-filter-date-range",
          payload: { groupIdx: 0, filterIdx: 0, dateRange: mockPast180DaysDateRange }
        });
      });

      expect(result.current[0].builder.criteria.filterGroups[0].canAddFilter).toBe(false);

      act(() => {
        dispatch({
          type: "update-filter-value",
          payload: { groupIdx: 0, filterIdx: 0, value: { range: ["10", null] } }
        });
      });

      expect(result.current[0].builder.criteria.filterGroups[0].canAddFilter).toBe(true);
    });

    it("is updated to true when multiple filters are complete", () => {
      const withAlmostCompleteFilters = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters = [
          mockTheoWinCriteriaFilter,
          { ...mockGFVChurnCriteriaFilter, range: undefined }
        ];
        draft.builder.criteria.filterGroups[0].canAddFilter = true;
      });
      const { result } = renderReducer(withAlmostCompleteFilters);
      const [, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-value",
          payload: { groupIdx: 0, filterIdx: 1, value: { range: ["10", null] } }
        });
      });

      expect(result.current[0].builder.criteria.filterGroups[0].canAddFilter).toBe(true);
    });

    it("is updated to false if a metric is changed to no longer be complete", () => {
      const withCompleteFilter = produce(mockState, (draft) => {
        draft.builder.criteria.filterGroups[0].filters[0] = mockTheoWinCriteriaFilter;
        draft.builder.criteria.filterGroups[0].canAddFilter = true;
      });
      const { result } = renderReducer(withCompleteFilter);
      const [, dispatch] = result.current;

      act(() => {
        dispatch({
          type: "update-filter-value",
          payload: { groupIdx: 0, filterIdx: 0, value: { range: [null, null] } }
        });
      });

      expect(result.current[0].builder.criteria.filterGroups[0].canAddFilter).toBe(false);
    });
  });

  describe("update-raw-string", () => {
    it("can update raw string", () => {
      const { result } = renderReducer(mockState);
      const [curState, dispatch] = result.current;

      act(() => {
        dispatch({ type: "update-raw-string", payload: { rawString: "raw string" } });
      });

      const [newState] = result.current;
      expect(curState.builder.rawString).toEqual("");
      expect(newState.builder.rawString).toEqual("raw string");
    });
  });
});
