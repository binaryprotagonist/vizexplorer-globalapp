import { PdOrgSettingsInput, PdTimePeriodInput } from "generated-graphql";
import { assetUnreachable } from "../../../../view/utils";
import { GlobalSetting } from "../types";
import { NumericDialog } from "../../../common/dialog";
import { globalSettingInputFromNumericValue, inputLabel } from "./utils";
import { TimePeriodSelection } from "./time-period-selection";

type Props = {
  setting: GlobalSetting;
  disabled: boolean;
  onSave: (input: PdOrgSettingsInput) => void;
  onClose: VoidFunction;
};

export function EditSettings({ setting, onSave, onClose, disabled }: Props) {
  if (setting.variant === "numeric") {
    return (
      <NumericDialog
        title={setting.name}
        description={setting.description}
        inputTitle={inputLabel(setting.id)}
        value={setting.config.value}
        min={setting.config.min}
        max={setting.config.max}
        onSave={(value) => {
          onSave(globalSettingInputFromNumericValue(setting, value));
        }}
        onClose={onClose}
        disabled={disabled}
      />
    );
  }

  if (
    setting.variant === "guest-time-periods" ||
    setting.variant === "host-time-periods"
  ) {
    return (
      <TimePeriodSelection
        title={setting.name}
        initialTimePeriod={setting.config.value}
        disabled={disabled}
        onCancel={onClose}
        onSave={(timePeriods) => {
          const timePeriodInput: PdTimePeriodInput[] = timePeriods.map((period) => ({
            level: period.level,
            count: period.count,
            enabled: period.enabled,
            default: period.default
          }));
          const input: PdOrgSettingsInput =
            setting.id === "guest-time-periods"
              ? { guestTimePeriods: timePeriodInput }
              : { hostTimePeriods: timePeriodInput };

          onSave(input);
        }}
      />
    );
  }

  assetUnreachable(setting);
}
