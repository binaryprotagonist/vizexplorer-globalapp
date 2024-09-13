import { Action } from "@material-table/core";
import { SiteFragment } from "generated-graphql";

export type SiteWithTzLabel = SiteFragment & { tzLabel: string };

export type SiteAction = (rowData: SiteWithTzLabel) => Action<SiteWithTzLabel>;

export type ActionEventFn = (actionType: ActionType, site: SiteWithTzLabel) => void;

export enum ActionType {
  EDIT = "edit",
  DELETE = "delete"
}
