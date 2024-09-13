import { PdOrgSettingsInput } from "generated-graphql";
import { assetUnreachable } from "../../../../view/utils";
import { PercentSetting } from "../types";

export function globalSettingInputFromNumericValue(
  setting: PercentSetting,
  value: PercentSetting["config"]["value"]
): PdOrgSettingsInput {
  if (setting.variant === "numeric") {
    const newValue = value as typeof setting.config.value;

    switch (setting.id) {
      case "worth-pct":
        return { worthPercentage: newValue };
      default:
        assetUnreachable(setting.id);
    }
  }

  assetUnreachable(setting.variant);
}

export function inputLabel(settingId: PercentSetting["id"]) {
  switch (settingId) {
    case "worth-pct":
      return "Worth Percentage";
    default:
      assetUnreachable(settingId);
  }
}
