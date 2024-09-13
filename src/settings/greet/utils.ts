import { GaUserFragment } from "generated-graphql";
import { GreetView } from "./types";
import { isOrgAdmin } from "../../view/user/utils";

export function greetSettingsTabLabel(type: GreetView): string {
  switch (type) {
    case "greet-rules":
      return "Greet rules";
    case "system-settings":
      return "System settings";
  }
}

export function canAccessGreetView(view: GreetView, user: GaUserFragment): boolean {
  switch (view) {
    case "greet-rules":
      return true;
    case "system-settings":
      return isOrgAdmin(user.accessLevel);
  }
}
