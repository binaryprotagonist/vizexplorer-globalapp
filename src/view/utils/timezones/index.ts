import timezones from "./timezones.json";

type TimeZone = {
  label: string;
  tzCode: string;
  name: string;
  utc: string;
};

export default timezones as TimeZone[];
