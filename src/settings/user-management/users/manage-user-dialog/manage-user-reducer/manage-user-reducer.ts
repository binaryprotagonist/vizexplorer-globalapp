import { OrgAccessLevel } from "generated-graphql";
import { ReducerAccess, ReducerAction, ReducerState } from "./types";
import { updateAccessRow } from "./actions";

export function manageUserReducer(state: ReducerState, action: ReducerAction) {
  switch (action.type) {
    case "update-first-name":
      state.user.firstName = action.payload.firstName;
      break;
    case "update-last-name":
      state.user.lastName = action.payload.lastName;
      break;
    case "update-phone":
      state.user.phone = action.payload.phone;
      break;
    case "update-email":
      state.user.email = action.payload.email;
      break;
    case "update-password":
      state.user.password = action.payload.password;
      break;
    case "update-access-level":
      state.user.accessLevel = action.payload.accessLevel;

      if (state.user.accessLevel === OrgAccessLevel.NoAccess) {
        state.user.password = "";
      }

      if (state.user.accessLevel === OrgAccessLevel.AppSpecific) {
        state.user.accessList = [{}];
      } else {
        state.user.accessList = [];
      }
      break;
    case "add-empty-access-row":
      if (state.user.accessLevel !== OrgAccessLevel.AppSpecific) {
        console.error("Cannot add access row for non app-specific access level");
        return;
      }

      state.user.accessList.push({});
      break;
    case "update-access-row-app": {
      const { rowIdx, appId } = action.payload;

      const siteAccess: ReducerAccess = { app: { id: appId } };
      updateAccessRow(state, rowIdx, siteAccess);
      break;
    }
    case "update-access-row-site": {
      const { rowIdx, siteId } = action.payload;

      const siteAccess: ReducerAccess = { site: { id: siteId } };
      updateAccessRow(state, rowIdx, siteAccess);
      break;
    }
    case "update-access-row-role": {
      const { rowIdx, roleId } = action.payload;

      const siteAccess: ReducerAccess = { role: { id: roleId } };
      updateAccessRow(state, rowIdx, siteAccess);
      break;
    }
    case "remove-access-row": {
      const rowIdx = action.payload.rowIdx;
      if (!state.user.accessList?.[rowIdx]) {
        console.error("Invalid access row index");
        return;
      }

      if (state.user.accessList.length <= 1) {
        state.user.accessList = [{}];
      } else {
        state.user.accessList.splice(rowIdx, 1);
      }
      break;
    }
    case "add-field-error": {
      const { field, error } = action.payload;
      if (!state.fieldErrors) {
        state.fieldErrors = { [field]: error };
      } else {
        state.fieldErrors[field] = error;
      }
      break;
    }
    case "clear-field-error": {
      const { field } = action.payload;
      if (!state.fieldErrors) return;
      delete state.fieldErrors[field];
      break;
    }
  }
}
