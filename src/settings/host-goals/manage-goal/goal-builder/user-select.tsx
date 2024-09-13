import React from "react";
import {
  Checkbox,
  FilterOptionsState,
  List,
  ListItem,
  ListItemButton
} from "@mui/material";
import {
  Autocomplete,
  AutocompleteProps,
  Chip,
  TextField,
  Typography,
  useGlobalTheme
} from "@vizexplorer/global-ui-v2";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import { UserDisplay } from "../../../../view/user/utils";
import { gql } from "@apollo/client";
import { HostGoalUserOptionFragment } from "./__generated__/user-select";
import { ArrayUtils } from "../../../../view/utils/array";

type InternalSelectAll = "__ALL__";
type InternalOption = HostGoalUserOptionFragment | InternalSelectAll;
type InternalAutocompleteProps = AutocompleteProps<InternalOption, true, true, false>;

type Props = {
  value: HostGoalUserOptionFragment[];
  options: HostGoalUserOptionFragment[];
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  limitTags?: number;
  onChange: (value: HostGoalUserOptionFragment[]) => void;
};

// Known limitations due to manipulating the MUI component beyond what it was designed to do
// - Group headers duplicate hover effect
// - Group headers are not focusable via keyboard

export function UserSelect({
  value,
  options,
  fullWidth = true,
  limitTags = 4,
  onChange,
  ...rest
}: Props) {
  const globalTheme = useGlobalTheme();
  const allSelected = value?.length === options.length;

  function isGroupSelected(group: string) {
    const groupLength = options.filter((user) => isUserInGroup(user, group)).length;
    const selectedGroupLength = value.filter((user) => isUserInGroup(user, group)).length;
    return groupLength === selectedGroupLength;
  }

  function handleGroupClick(group: string) {
    const groupUsers = options.filter((user) => isUserInGroup(user, group));
    const selectedGroupUsers = value.filter((user) => isUserInGroup(user, group));

    // deselect all users in the group
    if (selectedGroupUsers.length === groupUsers.length) {
      onChange(value.filter((user) => !isUserInGroup(user, group)));
      return;
    }

    // select all users in the group not already selected
    const remainingGroupUsers = ArrayUtils.objDiff(groupUsers, selectedGroupUsers, "id");
    onChange([...value, ...remainingGroupUsers]);
  }

  function filterOptions(
    options: InternalOption[],
    params: FilterOptionsState<InternalOption>
  ): InternalOption[] {
    if (!options.length) return [];
    if (params.inputValue === "") return ["__ALL__", ...options];

    return options.filter((option) => {
      if (option === "__ALL__") return false;

      const normalizedValue = params.inputValue.toLowerCase();
      const userGroupName = option.pdUserGroup?.name ?? "";
      return (
        optionLabel(option).toLowerCase().includes(normalizedValue) ||
        userGroupName.toLowerCase().includes(normalizedValue)
      );
    });
  }

  // below functions utilize arrow functions as otherwise typing is a nightmare

  const renderOption: InternalAutocompleteProps["renderOption"] = (
    props,
    option,
    { selected }
  ) => {
    return (
      <li
        {...props}
        style={{
          // add additional padding for user options that are part of a group
          ...(option !== "__ALL__" &&
            !!option.pdUserGroup?.name && { paddingLeft: "32px" })
        }}
      >
        <Checkbox
          icon={<CheckBoxOutlineBlankRoundedIcon fontSize={"small"} />}
          checkedIcon={<CheckBoxRoundedIcon fontSize={"small"} />}
          checked={selected || (option === "__ALL__" && value.length === options.length)}
        />
        <Typography variant={"bodySmall"} fontWeight={option == "__ALL__" ? 600 : 400}>
          {optionLabel(option)}
        </Typography>
      </li>
    );
  };

  const onKeyDown: InternalAutocompleteProps["onKeyDown"] = (e) => {
    // Prevent keyboard navigation via undocumented method. This helps reduce the visible impact of the known issues listed above
    // https://github.com/mui/material-ui/blob/v5.15.15/packages/mui-base/src/useAutocomplete/useAutocomplete.js#L795
    const blockedKeys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"];
    if (blockedKeys.includes(e.key)) {
      e.defaultMuiPrevented = true;
    }
  };

  const handleChange: InternalAutocompleteProps["onChange"] = (_e, newValue) => {
    // Select all isn't selected
    if (containsOnlyUserOptions(newValue)) {
      onChange(newValue);
      return;
    }

    // Select all is selected
    onChange(value?.length === options.length ? [] : options);
  };

  const renderTags: InternalAutocompleteProps["renderTags"] = (value, getTagProps) => {
    if (allSelected) {
      return (
        <Chip
          data-testid={"value-chip"}
          label={"All users"}
          size={"small"}
          style={{ margin: "0 0 0 2px", height: "30px" }}
          onDelete={() => onChange([])}
        />
      );
    }

    return value.map((option, index) => (
      <Chip
        data-testid={"value-chip"}
        label={optionLabel(option)}
        size={"small"}
        {...getTagProps({ index })}
        key={`value-${optionId(option)}`}
        style={{ margin: "1px 0 1px 2px", height: "30px" }}
      />
    ));
  };

  const renderInput: InternalAutocompleteProps["renderInput"] = (params) => (
    <TextField
      {...params}
      placeholder={!value.length ? "Search and select user/s" : undefined}
      onKeyDown={(event) => {
        // prevent backspace from removing the last chip
        if (event.key === "Backspace") {
          event.stopPropagation();
        }
      }}
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <>
            <AssignmentIndRoundedIcon sx={{ color: globalTheme.colors.grey[500] }} />
            {params.InputProps.startAdornment}
          </>
        )
      }}
    />
  );

  const renderGroup: InternalAutocompleteProps["renderGroup"] = (params) => {
    if (isGrouplessHeader(params.group)) {
      return <React.Fragment key={params.key}>{params.children}</React.Fragment>;
    }

    return (
      <List disablePadding key={params.key}>
        <ListItem disablePadding onClick={() => handleGroupClick(params.group)}>
          <ListItemButton data-testid={"group-header-btn"} role={"option"}>
            <Checkbox
              icon={<CheckBoxOutlineBlankRoundedIcon fontSize={"small"} />}
              checkedIcon={<CheckBoxRoundedIcon fontSize={"small"} />}
              checked={isGroupSelected(params.group)}
            />
            <span>{params.group}</span>
          </ListItemButton>
        </ListItem>
        <List disablePadding>{params.children}</List>
      </List>
    );
  };

  return (
    <Autocomplete
      multiple
      disableClearable
      disableCloseOnSelect
      data-testid={"user-select"}
      fullWidth={fullWidth}
      limitTags={limitTags}
      value={value}
      options={options}
      noOptionsText={"No users"}
      groupBy={groupHeader}
      getOptionLabel={optionLabel}
      filterOptions={filterOptions}
      onKeyDown={onKeyDown}
      onChange={handleChange}
      renderTags={renderTags}
      renderInput={renderInput}
      renderOption={renderOption}
      renderGroup={renderGroup}
      {...rest}
    />
  );
}

function optionId(option: InternalOption): string {
  if (option === "__ALL__") {
    return "__ALL__";
  }

  return option.id;
}

function optionLabel(option: InternalOption): string {
  if (option === "__ALL__") {
    return "All users";
  }

  return UserDisplay.fullNameV2(option);
}

// MUI expects options to be sorted by group.
// Because "All users" is at the top, and users without groups are at the bottom of the list, they need to belong to different groups,
// even though technically they are both groupless
function isGrouplessHeader(option: "all" | "no-user-group" | string): boolean {
  return option === "all" || option === "no-user-group";
}

function groupHeader(option: InternalOption): string {
  if (option === "__ALL__") {
    return "all";
  }

  if (!option.pdUserGroup) {
    return "no-user-group";
  }

  return option.pdUserGroup.name;
}

function containsOnlyUserOptions(
  options: InternalOption[]
): options is HostGoalUserOptionFragment[] {
  return options.every((option) => option !== "__ALL__");
}

function isUserInGroup(user: HostGoalUserOptionFragment, group: string) {
  return user.pdUserGroup?.name === group;
}

UserSelect.fragments = {
  userOption: gql`
    fragment HostGoalUserOption on User {
      id
      firstName
      lastName
      pdUserGroup {
        id
        name
      }
    }
  `
};
