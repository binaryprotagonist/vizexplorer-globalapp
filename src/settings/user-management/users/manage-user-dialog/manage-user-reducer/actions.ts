import { OrgAccessLevel } from "generated-graphql";
import { ReducerAccess, ReducerState } from "./types";

export function updateAccessRow(
  state: ReducerState,
  rowIdx: number,
  partialAccess: ReducerAccess
) {
  const rowErr = validateAccessRow(rowIdx, state);
  if (rowErr) {
    console.error(rowErr);
    return;
  }

  // only possible for the first row due to the check above. Other rows should have at least an empty object
  if (state.user.accessList.length === 0) {
    state.user.accessList = [partialAccess];
    return;
  }

  if (partialAccess.app) {
    // reset site and role if app is updated as the managing user may not have access to the selected property and the role may not be applicable
    state.user.accessList[rowIdx] = { app: partialAccess.app };
    return;
  }

  if (partialAccess.site) {
    state.user.accessList[rowIdx].site = partialAccess.site;
  }

  if (partialAccess.role) {
    state.user.accessList[rowIdx].role = partialAccess.role;
  }
}

// returns error string if validation fails
function validateAccessRow(rowIdx: number, state: ReducerState): string | null {
  if (state.user.accessLevel !== OrgAccessLevel.AppSpecific) {
    return "Cannot update access row for non app-specific access level";
  }

  if (rowIdx !== 0 && !state.user.accessList[rowIdx]) {
    return "Invalid access row index";
  }

  return null;
}
