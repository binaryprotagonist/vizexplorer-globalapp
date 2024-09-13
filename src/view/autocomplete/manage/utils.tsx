import { OptionChangeType, OptionTypeEditable, OptionTypeNew } from "./types";
import { OptionEditable } from "./option-editable";
import { OptionNew } from "./option-new";

export function createEditableOptions<T>(
  options: readonly T[],
  onChange: (changeType: OptionChangeType<T>) => void
): OptionTypeEditable<T>[] {
  return options.map<OptionTypeEditable<T>>((opt) => ({
    type: "editable",
    value: opt,
    render: (props, optValue) => (
      <OptionEditable
        {...props}
        value={optValue}
        onBtnClick={() => onChange({ type: "edit", value: opt })}
      />
    )
  }));
}

export function createNewOption<T>(
  label: string,
  onChange: (changeType: OptionChangeType<T>) => void
): OptionTypeNew {
  return {
    type: "new",
    value: label,
    render: (props, optValue) => (
      <OptionNew
        {...props}
        value={optValue}
        onBtnClick={() => onChange({ type: "new" })}
      />
    )
  };
}
