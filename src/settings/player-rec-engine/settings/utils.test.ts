import { PdValueMetric } from "generated-graphql";
import { displayTimeTz } from "../../../view/utils";
import {
  defaultLookbackPeriod,
  defaultMaxTasksPerHostCode,
  defaultTaskFetchLimit,
  defaultTaskSchedule,
  defaultValueMetric
} from "./types";
import { displaySettingValue, displayValueMetric } from "./utils";

describe("PDRE Settings Utils", () => {
  describe("displaySettingValue", () => {
    it("returns expected value for `value-metric` setting", () => {
      expect(displaySettingValue(defaultValueMetric)).toEqual("Average Daily Worth");
    });

    it("returns expected value for `lookback-period` setting", () => {
      expect(displaySettingValue(defaultLookbackPeriod)).toEqual("365");
    });

    it("returns expected value for `task-scheduler` setting", () => {
      expect(displaySettingValue(defaultTaskSchedule)).toEqual(
        displayTimeTz(defaultTaskSchedule.config.value)
      );
    });

    it("returns expected value for `max-tasks-per-host-code` setting", () => {
      expect(displaySettingValue(defaultMaxTasksPerHostCode)).toEqual("200");
    });

    it("returns expected value for `task-fetch-limit` setting", () => {
      expect(displaySettingValue(defaultTaskFetchLimit)).toEqual("25");
    });
  });

  describe("displayValueMetric", () => {
    it("returns expected values for `DailyAverage`", () => {
      expect(displayValueMetric(PdValueMetric.DailyAverage)).toEqual(
        "Average Daily Worth"
      );
    });

    it("returns expected values for `TripAverage`", () => {
      expect(displayValueMetric(PdValueMetric.TripAverage)).toEqual("Average Trip Worth");
    });

    it("returns expected values for `Total`", () => {
      expect(displayValueMetric(PdValueMetric.Total)).toEqual("Total Worth");
    });
  });
});
