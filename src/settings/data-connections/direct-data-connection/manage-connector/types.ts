export interface TimeZone {
  label: string;
  tzCode: string;
  name: string;
  utc: string;
}

export type TimeZoneOption = {
  label: string;
  value: string;
};

export type FormInput = {
  name: string;
  hostname: string;
  port: string;
  tlsEnabled: boolean;
  database: string;
  username: string;
  password: string;
  dataRefreshTime: Date | null;
  timezone: TimeZoneOption;
};
