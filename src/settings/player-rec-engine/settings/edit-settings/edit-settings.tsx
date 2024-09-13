import { PdreSetting } from "../types";
import { PdOrgSettingsInput } from "generated-graphql";
import { assetUnreachable } from "../../../../view/utils";
import { NumericDialog, SelectDialog, TimeTzDialog } from "../../../common";
import { displaySelectOption, inputLabel, pdreSettingInputFromValue } from "./utils";

type Props = {
  setting: PdreSetting;
  onSave: (input: PdOrgSettingsInput) => void;
  onClose: VoidFunction;
  disabled: boolean;
};

export function EditSettings({ setting, onSave, onClose, disabled }: Props) {
  function onClickSave<T extends PdreSetting>(setting: T, value: T["config"]["value"]) {
    onSave(pdreSettingInputFromValue(setting, value));
  }

  if (setting.variant === "numeric") {
    return (
      <NumericDialog
        title={setting.name}
        description={setting.description}
        inputTitle={inputLabel(setting.id)}
        value={setting.config.value}
        min={setting.config.min}
        max={setting.config.max}
        onSave={(value) => onClickSave(setting, value)}
        onClose={onClose}
        disabled={disabled}
      />
    );
  }

  if (setting.variant === "select") {
    return (
      <SelectDialog
        title={setting.name}
        description={setting.description}
        inputTitle={inputLabel(setting.id)}
        value={setting.config.value}
        options={setting.config.options}
        getOptionLabel={(o) => displaySelectOption(setting.id, o)}
        onSave={(value) => onClickSave(setting, value)}
        onClose={onClose}
        disabled={disabled}
      />
    );
  }

  if (setting.variant === "time-tz") {
    return (
      <TimeTzDialog
        title={setting.name}
        description={setting.description}
        value={setting.config.value}
        onSave={(value) => onClickSave(setting, value)}
        onClose={onClose}
        disabled={disabled}
      />
    );
  }

  assetUnreachable(setting);
}
