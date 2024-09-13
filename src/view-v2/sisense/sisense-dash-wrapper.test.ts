import { produce } from "immer";
import { generateDummySisenseDashs } from "./__mocks__/sisense";
import { SisenseDashWrapper, SisenseFilterWrapper } from "./sisense-dash-wrapper";

const mockSisenseDash = generateDummySisenseDashs(1)[0];
mockSisenseDash.$$model.filters.$$items = [
  { jaql: { title: "test", dim: "[column.test]" } }
];
const mockSisenseDashboardFilters = mockSisenseDash.$$model.filters;

describe("api-wrapper", () => {
  describe("SisenseDashWrapper", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("can instantiate", () => {
      expect(new SisenseDashWrapper(mockSisenseDash)).toBeTruthy();
    });

    it("instantiates with filter wrapper", () => {
      const wrapper = new SisenseDashWrapper(mockSisenseDash);
      expect(wrapper.filters).toBeInstanceOf(SisenseFilterWrapper);
    });

    it("returns expected id", () => {
      const wrapper = new SisenseDashWrapper(mockSisenseDash);
      expect(wrapper.id()).toEqual(mockSisenseDash.id);
    });

    it("calls destroy on inner dashboard when destroyed", () => {
      const wrapper = new SisenseDashWrapper(mockSisenseDash);
      wrapper.destroy();
      expect(mockSisenseDash.$$model.destroy).toHaveBeenCalled();
    });

    it("doesn't call destry on inner dashboard when destroyed if already destroyed", () => {
      const destroyed = produce(mockSisenseDash, (draft) => {
        draft.$$model.$$destroyed = true;
      });
      const wrapper = new SisenseDashWrapper(destroyed);
      wrapper.destroy();
      expect(mockSisenseDash.$$model.destroy).not.toHaveBeenCalled();
    });
  });

  describe("SisenseFilterWrapper", () => {
    it("can instantiate", () => {
      expect(new SisenseFilterWrapper(mockSisenseDashboardFilters)).toBeTruthy();
    });

    it("returns expected filters items", () => {
      const wrapper = new SisenseFilterWrapper(mockSisenseDashboardFilters);
      expect(wrapper.items()).toEqual(mockSisenseDashboardFilters.$$items);
    });

    it("returns expected filter by title if the filter exists", () => {
      const wrapper = new SisenseFilterWrapper(mockSisenseDashboardFilters);
      const filter = wrapper.findByTitle("test");
      expect(filter).toEqual(mockSisenseDashboardFilters.$$items[0]);
    });

    it("returns undefined if filter by title doesn't exist", () => {
      const wrapper = new SisenseFilterWrapper(mockSisenseDashboardFilters);
      const filter = wrapper.findByTitle("test2");
      expect(filter).toBeUndefined();
    });

    it("calls update on filters with expected filter and default options", () => {
      const wrapper = new SisenseFilterWrapper(mockSisenseDashboardFilters);
      const filter = mockSisenseDashboardFilters.$$items[0];
      wrapper.update(filter);
      expect(mockSisenseDashboardFilters.update).toHaveBeenCalledWith(filter, {
        refresh: true,
        save: false
      });
    });

    it("calls update with expected filter and provided options", () => {
      const wrapper = new SisenseFilterWrapper(mockSisenseDashboardFilters);
      const filter = mockSisenseDashboardFilters.$$items[0];
      wrapper.update(filter, { refresh: false, save: true });
      expect(mockSisenseDashboardFilters.update).toHaveBeenCalledWith(filter, {
        refresh: false,
        save: true
      });
    });

    it("calls update with expected filter and provided partial options", () => {
      const wrapper = new SisenseFilterWrapper(mockSisenseDashboardFilters);
      const filter = mockSisenseDashboardFilters.$$items[0];
      wrapper.update(filter, { refresh: false });
      expect(mockSisenseDashboardFilters.update).toHaveBeenCalledWith(filter, {
        refresh: false,
        save: false
      });
    });
  });
});
