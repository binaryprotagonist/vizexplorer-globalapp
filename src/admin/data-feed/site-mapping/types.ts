import { Action } from "@material-table/core";

export type MappingData = {
  id: number;
  vodProperty: string;
  sourceProperty?: string | null;
};

export type MappingActionFn = (rowData: MappingData) => Action<MappingData>;
