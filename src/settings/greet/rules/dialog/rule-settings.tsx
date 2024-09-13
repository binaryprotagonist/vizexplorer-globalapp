import { Box } from "@mui/material";
import { Switch, TextField, Typography, useGlobalTheme } from "@vizexplorer/global-ui-v2";
import { GridInputLayout, Select, SelectOption } from "../../components";
import { DraftMultiSelectValue, ReducerAction, ReducerState } from "../reducer/types";
import { Dispatch } from "react";
import { SectionsIcon } from "../../../common/icons";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import { InputLabel } from "view-v2/input-label";
import { CheckboxMultiSelect } from "view-v2/multi-select";

type Props = {
  state: ReducerState;
  sites: SelectOption<string>[];
  sectionOptions: string[];
  sectionsLoading?: boolean;
  isNameTaken?: boolean;
  dispatch: Dispatch<ReducerAction>;
  disableFields?: boolean;
};

export function RuleSettings({
  state,
  sites,
  sectionOptions,
  sectionsLoading,
  isNameTaken = false,
  dispatch,
  disableFields = false
}: Props) {
  const theme = useGlobalTheme();
  const isMultiProperty = sites.length > 1;
  const { sections } = state.rule.specialTriggers;

  return (
    <GridInputLayout data-testid={"rule-settings"} isMultiProperty={isMultiProperty}>
      <Box display={"flex"} flexDirection={"column"}>
        <InputLabel>Rule Name</InputLabel>
        <TextField
          data-testid={"rule-name-input"}
          value={state.rule.name}
          onChange={(e) =>
            dispatch({ type: "UPDATE_NAME", payload: { name: e.target.value } })
          }
          error={isNameTaken}
          helperText={isNameTaken ? "Rule name already exists" : " "}
          placeholder={"Enter a name..."}
          autoComplete={"off"}
          disabled={disableFields}
        />
      </Box>

      {isMultiProperty && (
        <Box display={"flex"} flexDirection={"column"}>
          <InputLabel>Property</InputLabel>
          <Select
            data-testid={"property-select"}
            selected={state.rule.siteId}
            options={sites}
            onChange={(property) =>
              dispatch({ type: "UPDATE_PROPERTY", payload: { siteId: property.value } })
            }
            startAdornment={
              <ApartmentRoundedIcon sx={{ fill: theme.colors.grey[500] }} />
            }
            placeholder={"Select property"}
            disabled={disableFields}
          />
        </Box>
      )}

      <Box display={"flex"} flexDirection={"column"}>
        <InputLabel
          data-testid={"section-count-label"}
          type={"count"}
          label={"Section"}
          count={sectionsValue(sections, sectionOptions).length}
        />
        <CheckboxMultiSelect
          showSelectAll
          fullWidth
          data-testid={"section-select"}
          value={sectionsValue(sections, sectionOptions)}
          options={sectionOptions}
          icon={<SectionsIcon />}
          allOptionLabel={"All sections"}
          onChange={(selected) => {
            const sections =
              selected.length === sectionOptions.length ? "__ALL__" : selected;

            dispatch({
              type: "UPDATE_SECTIONS",
              payload: { sections }
            });
          }}
          limitTags={1}
          loading={sectionsLoading}
          placeholder={"Select section"}
          disabled={disableFields}
        />
      </Box>

      <Box mt={0.5}>
        <Typography variant={"bodySmall"}>Enable Rule</Typography>
        <Switch
          data-testid={"enable-rule-switch"}
          color={"success"}
          checked={state.rule.isEnabled}
          onChange={(_e, checked) =>
            dispatch({ type: "UPDATE_ENABLED", payload: { enabled: checked } })
          }
          disabled={disableFields}
        />
      </Box>
    </GridInputLayout>
  );
}

function sectionsValue(
  sections: DraftMultiSelectValue<string> | null,
  allSections: string[]
): string[] {
  if (!sections) return [];
  return sections === "__ALL__" ? allSections : sections;
}
