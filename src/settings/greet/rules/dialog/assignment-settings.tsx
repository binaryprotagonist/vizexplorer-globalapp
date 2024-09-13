import { Box, Slider, styled } from "@mui/material";
import { GridInputLayout, Select, SelectOption } from "../../components";
import { TextField, useGlobalTheme } from "@vizexplorer/global-ui-v2";
import {
  AssignTo,
  OverflowAssignTo,
  OverflowGreetAssignmentType,
  ReducerAction,
  ReducerState
} from "../reducer/types";
import { Dispatch } from "react";
import { PdGreetAssignmentType, PdGuestInteractionType } from "generated-graphql";
import {
  isAssignmentGroupComplete,
  isGuestAndAssignmentTypeCompatible,
  isWeightValid
} from "../reducer";
import { greetAssignmentTypeLabel } from "../utils";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { InputLabel } from "view-v2/input-label";

const OverflowGroupGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
  columnGap: theme.spacing(4),
  gridColumn: "2 / span 2"
}));

export type UserGroupOption = SelectOption<
  string,
  { guestInteraction?: PdGuestInteractionType | null }
>;

type Props = {
  isMultiProperty: boolean;
  state: ReducerState;
  dispatch: Dispatch<ReducerAction>;
  userGroups: UserGroupOption[];
  disableFields?: boolean;
};

export function AssignmentSettings({
  isMultiProperty,
  state,
  dispatch,
  userGroups,
  disableFields = false
}: Props) {
  const { guestType } = state.rule.specialTriggers;
  const { weight, assignTo, overflowGroup1, overflowGroup2 } = state.rule.assignment;
  const userGroupsForGuestType = userGroups.filter((group) =>
    groupMatchesGuestType(group, guestType)
  );

  return (
    <GridInputLayout
      data-testid={"assignment-settings"}
      isMultiProperty={isMultiProperty}
      mb={4}
    >
      <Weight
        weight={weight}
        onChange={(value) =>
          dispatch({ type: "UPDATE_WEIGHT", payload: { weight: value } })
        }
        disabled={disableFields}
      />

      <AssignTo
        assignTo={assignTo}
        assignmentOptions={assignToGroupOptions(state)}
        userGroups={userGroupsForGuestType}
        onChange={(type, userGroupId) =>
          dispatch({
            type: "UPDATE_ASSIGN_TO",
            payload: {
              assignmentToType: type,
              userGroupId: userGroupId
            }
          })
        }
        disabled={!guestType || disableFields}
      />

      {!!assignTo && showNextAssignment(assignTo) && (
        <OverflowGroupGrid>
          <Overflow
            assignTo={overflowGroup1 ?? null}
            assignmentOptions={overflow1GroupOptions(state)}
            userGroups={userGroupsForGuestType.filter(
              (group) => group.value !== groupId(assignTo)
            )}
            onChange={(type, userGroupId) =>
              dispatch({
                type: "UPDATE_OVERFLOW1",
                payload: { assignmentToType: type, userGroupId: userGroupId }
              })
            }
            disabled={!isAssignmentGroupComplete(assignTo) || disableFields}
          />
        </OverflowGroupGrid>
      )}

      {!!overflowGroup1 && showNextAssignment(overflowGroup1) && (
        <OverflowGroupGrid>
          <Overflow
            depth={2}
            assignTo={overflowGroup2 ?? null}
            assignmentOptions={overflow2GroupOptions(state)}
            userGroups={userGroupsForGuestType.filter(
              (group) =>
                group.value !== groupId(assignTo) &&
                group.value !== groupId(overflowGroup1)
            )}
            onChange={(type, userGroupId) =>
              dispatch({
                type: "UPDATE_OVERFLOW2",
                payload: { assignmentToType: type, userGroupId: userGroupId }
              })
            }
            disabled={!isAssignmentGroupComplete(overflowGroup1) || disableFields}
          />
        </OverflowGroupGrid>
      )}
    </GridInputLayout>
  );
}

function groupMatchesGuestType(
  group: UserGroupOption,
  guestType?: PdGuestInteractionType | null
): boolean {
  if (!group.guestInteraction || !guestType) return false;
  return (
    guestType === PdGuestInteractionType.All ||
    group.guestInteraction === PdGuestInteractionType.All ||
    group.guestInteraction === guestType
  );
}

function showNextAssignment(prevAssignment: AssignTo | OverflowAssignTo): boolean {
  return (
    prevAssignment.assignmentToType !== PdGreetAssignmentType.AllUsers &&
    prevAssignment.assignmentToType !== "None"
  );
}

function groupId(assignment?: AssignTo | OverflowAssignTo | null): string | null {
  return assignment?.assignmentToType === PdGreetAssignmentType.SpecificUserGroup
    ? assignment.userGroupId ?? null
    : null;
}

function weightFromInput(value: string): number | null {
  const numValue = Number(value);
  const isValidNumber = !isNaN(numValue) && value !== "";
  return isValidNumber ? numValue : null;
}

const WEIGHT_HELP =
  "How important is this rule in comparison with others. The greater the weight, the more likely to be assigned first.";

type WeightProps = {
  weight: number | null;
  onChange: (weight: number | null) => void;
  disabled: boolean;
};

function Weight({ weight, onChange, disabled }: WeightProps) {
  const theme = useGlobalTheme();

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <InputLabel help={WEIGHT_HELP}>Assignment weight</InputLabel>
      <Box display={"flex"} gap={"14px"} alignItems={"center"}>
        <Slider
          data-testid={"weight-slider"}
          value={weight ?? 0}
          onChange={(_e, value) => {
            onChange(value as number);
          }}
          sx={{
            ml: "8px"
          }}
          disabled={disabled}
        />
        <TextField
          data-testid={"weight-input"}
          type={"tel"}
          value={weight}
          onChange={(e) => {
            onChange(weightFromInput(e.target.value));
          }}
          error={!isWeightValid(weight)}
          inputProps={{ maxLength: 3, sx: { color: theme.colors.grey[400] } }}
          sx={{
            maxWidth: "55px"
          }}
          disabled={disabled}
        />
      </Box>
    </Box>
  );
}

type AssignmentOption = SelectOption<PdGreetAssignmentType>;

const ASSIGNMENT_OPTIONS: AssignmentOption[] = Object.values(PdGreetAssignmentType).map(
  (type) => ({ label: greetAssignmentTypeLabel(type), value: type })
);

const USER_GROUP_HELP =
  "The available User Groups for selection depend on the chosen Guest Type. Only the ones associated with the selected Guest Type's interaction will be displayed.";

function assignToGroupOptions(state: ReducerState): AssignmentOption[] {
  const guestType = state.rule.specialTriggers.guestType;
  if (!guestType) return [];

  return ASSIGNMENT_OPTIONS.filter((option) =>
    isGuestAndAssignmentTypeCompatible(option.value, guestType)
  );
}

type AssignToProps = {
  assignTo: AssignTo | null;
  assignmentOptions: AssignmentOption[];
  onChange: (type: PdGreetAssignmentType, userGroupId?: string) => void;
  userGroups: SelectOption<string>[];
  disabled: boolean;
};

function AssignTo({
  assignTo,
  assignmentOptions,
  onChange,
  userGroups,
  disabled
}: AssignToProps) {
  const theme = useGlobalTheme();

  return (
    <>
      <Box display={"flex"} flexDirection={"column"}>
        <InputLabel>Assign to</InputLabel>
        <Select
          data-testid={"assign-to-select"}
          selected={assignTo?.assignmentToType ?? null}
          onChange={(newAssignTo) => {
            onChange(newAssignTo.value);
          }}
          options={assignmentOptions}
          disabled={disabled}
          placeholder={"Select assignment"}
          startAdornment={
            <AssignmentIndRoundedIcon sx={{ fill: theme.colors.grey[500] }} />
          }
        />
      </Box>
      {assignTo?.assignmentToType === PdGreetAssignmentType.SpecificUserGroup && (
        <Box display={"flex"} flexDirection={"column"}>
          <InputLabel help={USER_GROUP_HELP}>User group</InputLabel>
          <Select
            data-testid={"assign-to-group-select"}
            selected={assignTo?.userGroupId ?? null}
            onChange={(newGroup) => {
              onChange(assignTo.assignmentToType, newGroup.value);
            }}
            options={userGroups}
            disabled={disabled}
            placeholder={"Select group"}
            startAdornment={<GroupsRoundedIcon sx={{ fill: theme.colors.grey[500] }} />}
          />
        </Box>
      )}
    </>
  );
}

const OVERFLOW_ASSIGNMENT_OPTIONS: OverflowAssignmentOption[] = [
  ...ASSIGNMENT_OPTIONS,
  { label: "None", value: "None" }
];

type OverflowAssignmentOption = {
  label: string;
  value: OverflowGreetAssignmentType;
};

function isAssignmentTypeUsed<T extends AssignmentOption | OverflowAssignmentOption>(
  assignment: T,
  assignments: (AssignTo | OverflowAssignTo | undefined | null)[]
): boolean {
  const usedAssignments = assignments
    .map((assignment) => assignment?.assignmentToType)
    // None and Specific User Group can be re-used
    .filter(
      (type) =>
        !!type && type !== "None" && type !== PdGreetAssignmentType.SpecificUserGroup
    );

  return usedAssignments.includes(assignment.value);
}

function overflow1GroupOptions(state: ReducerState): OverflowAssignmentOption[] {
  const guestType = state.rule.specialTriggers.guestType;
  if (!guestType) return [];

  const { assignTo } = state.rule.assignment;
  return OVERFLOW_ASSIGNMENT_OPTIONS.filter((option) => {
    return (
      isGuestAndAssignmentTypeCompatible(option.value, guestType) &&
      !isAssignmentTypeUsed(option, [assignTo])
    );
  });
}

function overflow2GroupOptions(state: ReducerState): OverflowAssignmentOption[] {
  const guestType = state.rule.specialTriggers.guestType;
  if (!guestType) return [];

  const { assignTo, overflowGroup1 } = state.rule.assignment;
  return OVERFLOW_ASSIGNMENT_OPTIONS.filter((option) => {
    return (
      isGuestAndAssignmentTypeCompatible(option.value, guestType) &&
      !isAssignmentTypeUsed(option, [assignTo, overflowGroup1])
    );
  });
}

const OVERFLOW_ASSIGNMENT_HELP =
  "If no members from the Assignment chosen is available, the system will automatically overflow to another User or User Group.";

type Overflow1Props = {
  depth?: number;
  assignTo: OverflowAssignTo | null;
  assignmentOptions: OverflowAssignmentOption[];
  onChange: (type: OverflowGreetAssignmentType, userGroupId?: string) => void;
  userGroups: SelectOption<string>[];
  disabled: boolean;
};

function Overflow({
  depth,
  assignTo,
  assignmentOptions,
  onChange,
  userGroups,
  disabled
}: Overflow1Props) {
  const theme = useGlobalTheme();
  const overflowLabel = `Overflow${depth ? ` ${depth}` : ""}`;

  return (
    <>
      <Box display={"flex"} flexDirection={"column"}>
        <InputLabel help={OVERFLOW_ASSIGNMENT_HELP}>
          {overflowLabel} assignment
        </InputLabel>
        <Select
          data-testid={"overflow-select"}
          selected={assignTo?.assignmentToType ?? null}
          onChange={(newAssignTo) => {
            onChange(newAssignTo.value);
          }}
          options={assignmentOptions}
          disabled={disabled}
          placeholder={"Select assignment"}
          startAdornment={
            <ArrowForwardRoundedIcon sx={{ fill: theme.colors.grey[500] }} />
          }
        />
      </Box>
      {assignTo?.assignmentToType === PdGreetAssignmentType.SpecificUserGroup && (
        <Box display={"flex"} flexDirection={"column"}>
          <InputLabel>{overflowLabel} group</InputLabel>
          <Select
            data-testid={"overflow-group-select"}
            selected={assignTo?.userGroupId ?? null}
            onChange={(newGroup) => {
              onChange(assignTo.assignmentToType, newGroup.value);
            }}
            options={userGroups}
            disabled={disabled}
            placeholder={"Select group"}
            startAdornment={<GroupsRoundedIcon sx={{ fill: theme.colors.grey[500] }} />}
          />
        </Box>
      )}
    </>
  );
}
