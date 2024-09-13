import { GaUserFragment } from "generated-graphql";
import { UserActionType } from "../../view/user/types";
import { canUser } from "../../view/user/utils";
import { AppOption } from "./types";

/**
 * Build a list of supported `AppOptions` based on applications which have valid subscriptions and the user has access to
 * */
export function buildAppOptions(currentUser: GaUserFragment): AppOption[] {
  const options: AppOption[] = [];

  if (
    canUser(currentUser, {
      type: UserActionType.ACCESS_PDR_DATA_CONN
    })
  ) {
    options.push(AppOption.PDR);
  }

  return options;
}
