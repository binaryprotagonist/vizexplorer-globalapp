import { Column } from "@material-table/core";
import { TableData } from "./types";
import { displaySchedule } from "./utils";

export const vizOndemandProperty: Column<TableData> = {
  title: "VizOnDemand Property",
  field: "vizSite",
  width: "18%"
};

export const sourceConnection: Column<TableData> = {
  title: "Source Connection",
  field: "connectionName",
  width: "18%"
};

export const sourceProperty: Column<TableData> = {
  title: "Source Property",
  field: "sourceSite",
  width: "13%"
};

export const dataRefreshTime: Column<TableData> = {
  title: "Data Refresh Time",
  render: (source) =>
    source.dataRefreshTime ? displaySchedule(source.dataRefreshTime) : "",
  customFilterAndSearch: (search: string, source) => {
    const dataRefreshTime = source.dataRefreshTime
      ? displaySchedule(source.dataRefreshTime)
      : "";
    return dataRefreshTime.toLowerCase().includes(search.toLowerCase());
  },
  customSort: (sA, sB) => {
    const a = sA.dataRefreshTime ? displaySchedule(sA.dataRefreshTime) : "";
    const b = sB.dataRefreshTime ? displaySchedule(sB.dataRefreshTime) : "";
    return new Intl.Collator().compare(a, b);
  }
};
