import { DataRefreshTimeFragment } from "generated-graphql";

export type TableData = {
  id: string;
  sourceId: string;
  vizSite: string;
  connectionName?: string;
  sourceSite?: string;
  dataRefreshTime?: DataRefreshTimeFragment | null;
};
