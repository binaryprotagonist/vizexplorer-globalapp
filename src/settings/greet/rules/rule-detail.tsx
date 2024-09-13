import styled from "@emotion/styled";
import { Box, useTheme } from "@mui/material";
import { Tooltip, Typography, useGlobalTheme } from "@vizexplorer/global-ui-v2";
import {
  GreetRuleAssignmentFragment,
  GreetRuleGroupAssignmentFragment,
  GreetRuleMetricTriggerFragment,
  PdGreetAssignmentType,
  PdGreetRuleSpecialTriggerValue
} from "generated-graphql";
import { SectionsIcon } from "../../common/icons";
import {
  buildSpecialTriggerObj,
  greetAssignmentTypeLabel,
  guestTypeValueLabel,
  isMetricTrigger,
  isSpecialTrigger,
  metricTriggerValueLabel,
  specialTriggerValueLabel
} from "./utils";
import { GreetRuleTrigger } from "./types";
import { SvgIconComponent } from "@mui/icons-material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import EqualizerRoundedIcon from "@mui/icons-material/EqualizerRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import DoDisturbRoundedIcon from "@mui/icons-material/DoDisturbRounded";

const ConditionContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2, 4),
  flexWrap: "wrap"
}));

type Props = {
  triggers: GreetRuleTrigger[];
  ignoreSuppression: boolean;
  assignment?: GreetRuleAssignmentFragment | null;
  multiproperty?: boolean;
  siteName?: string;
};

export function RuleDetail({
  triggers,
  ignoreSuppression,
  assignment,
  multiproperty = false,
  siteName
}: Props) {
  const theme = useTheme();
  const metricTriggers = triggers.filter(isMetricTrigger);
  const specialTriggers = triggers.filter(isSpecialTrigger);
  const { sections, guestType, daysOfWeeks, tiers } =
    buildSpecialTriggerObj(specialTriggers);

  return (
    <Box data-testid={"rule-detail"} display={"grid"} rowGap={theme.spacing(2)}>
      <ConditionContainer>
        {sections && (
          <PropertySections
            siteName={siteName ?? "Unknown property"}
            sections={specialTriggerValueLabel(sections, "All sections")}
            multiproperty={multiproperty}
          />
        )}
      </ConditionContainer>

      <TriggerSettings
        guestType={guestType}
        tiers={tiers}
        daysOfWeek={daysOfWeeks}
        metricTriggers={metricTriggers}
        ignoreSuppression={ignoreSuppression}
      />

      {assignment && <AssignmentSettings assignment={assignment} />}
    </Box>
  );
}

type PropertySectionProps = {
  siteName: string;
  sections: string;
  multiproperty: boolean;
};

function PropertySections({ siteName, sections, multiproperty }: PropertySectionProps) {
  if (!multiproperty) {
    return (
      <ConditionLabel
        data-testid={"sections"}
        tooltip={"Sections"}
        Icon={SectionsIcon}
        label={sections}
      />
    );
  }

  return (
    <ConditionLabel
      data-testid={"property-sections"}
      tooltip={"Property and sections"}
      Icon={ApartmentRoundedIcon}
      label={`${siteName}, ${sections}`}
    />
  );
}

type IconLabelProps = {
  tooltip: string;
  Icon: SvgIconComponent;
  label: string;
};

function ConditionLabel({ tooltip, Icon, label, ...rest }: IconLabelProps) {
  const theme = useGlobalTheme();

  return (
    <Box display={"flex"} alignItems={"center"} width={"max-content"} {...rest}>
      <Tooltip title={tooltip} placement={"right"}>
        <Icon sx={{ mr: (theme) => theme.spacing(1), color: theme.colors.grey[500] }} />
      </Tooltip>
      <Typography variant={"bodySmall"}>{label}</Typography>
    </Box>
  );
}

type TriggerSettingsProps = {
  guestType?: PdGreetRuleSpecialTriggerValue;
  tiers?: PdGreetRuleSpecialTriggerValue;
  daysOfWeek?: PdGreetRuleSpecialTriggerValue;
  metricTriggers: GreetRuleMetricTriggerFragment[];
  ignoreSuppression: boolean;
};

function TriggerSettings({
  guestType,
  tiers,
  daysOfWeek,
  metricTriggers,
  ignoreSuppression
}: TriggerSettingsProps) {
  const theme = useTheme();
  const globalTheme = useGlobalTheme();

  return (
    <Box>
      <Typography
        variant={"label"}
        color={globalTheme.colors.grey[400]}
        mb={theme.spacing(1)}
      >
        TRIGGER SETTINGS
      </Typography>

      <ConditionContainer>
        {guestType && (
          <ConditionLabel
            data-testid={"guest-type"}
            tooltip={"Guest type"}
            Icon={AccountCircleRoundedIcon}
            label={guestTypeValueLabel(guestType)}
          />
        )}
        {tiers && (
          <ConditionLabel
            data-testid={"tiers"}
            tooltip={"Tier"}
            Icon={StarRateRoundedIcon}
            label={specialTriggerValueLabel(tiers, "All tiers")}
          />
        )}
        {daysOfWeek && (
          <ConditionLabel
            data-testid={"days-of-week"}
            tooltip={"Days of the week"}
            Icon={CalendarMonthRoundedIcon}
            label={specialTriggerValueLabel(daysOfWeek, "All days")}
          />
        )}
        {metricTriggers.map((trigger, idx) => (
          <ConditionLabel
            data-testid={"metric-trigger"}
            key={`metric-trigger-${idx}`}
            tooltip={"Metric"}
            Icon={EqualizerRoundedIcon}
            label={`${trigger.metric?.label ?? "Unknown"}: ${metricTriggerValueLabel(
              trigger
            )}`}
          />
        ))}
        <ConditionLabel
          data-testid={"ignore-suppression"}
          tooltip={"Ignore suppression"}
          Icon={DoDisturbRoundedIcon}
          label={`Ignore suppression: ${ignoreSuppression ? "on" : "off"}`}
        />
      </ConditionContainer>
    </Box>
  );
}

function overflowGroup(assignment: GreetRuleGroupAssignmentFragment): string | null {
  if (!assignment?.assignmentToType) return null;

  if (assignment.assignmentToType === PdGreetAssignmentType.SpecificUserGroup) {
    return assignment.userGroup?.name ?? "Group not found";
  }

  return greetAssignmentTypeLabel(assignment.assignmentToType);
}

type AssignmentSettingsProps = {
  assignment: GreetRuleAssignmentFragment;
};

function AssignmentSettings({ assignment }: AssignmentSettingsProps) {
  const theme = useTheme();
  const globalTheme = useGlobalTheme();
  const assignTo = assignment.assignTo;
  const overflow1 = assignment?.overflowAssignment
    ? overflowGroup(assignment.overflowAssignment)
    : null;
  const overflow2 = assignment?.overflowAssignment2
    ? overflowGroup(assignment.overflowAssignment2)
    : null;

  return (
    <Box>
      <Typography
        variant={"label"}
        color={globalTheme.colors.grey[400]}
        mb={theme.spacing(1)}
      >
        ASSIGNMENT SETTINGS
      </Typography>

      <ConditionContainer>
        <ConditionLabel
          data-testid={"assignment-weight"}
          tooltip={"Assignment weight"}
          Icon={FitnessCenterRoundedIcon}
          label={assignment.weight.toString()}
        />
        {assignTo?.assignmentToType && (
          <ConditionLabel
            data-testid={"assign-to"}
            tooltip={"Assign to"}
            Icon={AssignmentIndRoundedIcon}
            label={greetAssignmentTypeLabel(assignTo.assignmentToType)}
          />
        )}
        {assignTo?.userGroup && (
          <ConditionLabel
            data-testid={"user-group"}
            tooltip={"User group"}
            Icon={GroupsRoundedIcon}
            label={assignTo.userGroup.name}
          />
        )}
        {overflow1 && (
          <ConditionLabel
            data-testid={"user-group-overflow1"}
            tooltip={"Overflow user group"}
            Icon={ArrowForwardRoundedIcon}
            label={overflow1}
          />
        )}
        {overflow2 && (
          <ConditionLabel
            data-testid={"user-group-overflow2"}
            tooltip={"Overflow user group"}
            Icon={ArrowForwardRoundedIcon}
            label={overflow2}
          />
        )}
      </ConditionContainer>
    </Box>
  );
}
