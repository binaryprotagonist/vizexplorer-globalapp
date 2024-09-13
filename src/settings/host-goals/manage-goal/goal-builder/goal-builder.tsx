import { Box, styled, tooltipClasses, useTheme } from "@mui/material";
import {
  Button,
  LoadingButton,
  Paper,
  TextField,
  Typography,
  useGlobalTheme
} from "@vizexplorer/global-ui-v2";
import { HelpTip } from "view-v2/help-tip";
import { InputLabel } from "view-v2/input-label";
import {
  CompletedReducerGoal,
  ReducerGoal,
  manageGoalReducer
} from "../manage-goal-reducer";
import { useImmerReducer } from "use-immer";
import { DateRangeField } from "./date-range-field";
import { UserSelect } from "./user-select";
import { gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { isGoalComplete, isMappedAccessUser, sortGroupsAndUsers } from "./utils";
import { HostGoalUserOptionFragment } from "./__generated__/user-select";
import { CheckboxMultiSelect } from "view-v2/multi-select";
import LeaderboardRounded from "@mui/icons-material/LeaderboardRounded";
import {
  GoalBuilderGoalFragment,
  GoalBuilderGoalMetricFragment,
  useGoalMetricsQuery,
  useGoalUsersQuery
} from "./__generated__/goal-builder";
import { sortArray } from "../../../../view/utils";
import { useAlert } from "view-v2/alert";
import { TargetValuesGrid } from "../../target-values-grid";
import { goBackUrl } from "../utils";
import { PageContainer, PageContainerBreakout } from "view-v2/page";

const TargetValuesPaper = styled(Paper)(({ theme }) => ({
  display: "grid",
  overflow: "hidden",
  width: "100%",
  height: "max-content",
  marginTop: theme.spacing(1)
}));

type Props = {
  title: string;
  description: string;
  goal: ReducerGoal;
  programs: GoalBuilderGoalFragment[];
  siteId: string;
  saving: boolean;
  loading?: boolean;
  onSave: (goal: CompletedReducerGoal) => void;
};

export function GoalBuilder({
  title,
  description,
  goal,
  programs,
  siteId,
  saving,
  loading: providedLoading = false,
  onSave
}: Props) {
  const [state, dispatch] = useImmerReducer(manageGoalReducer, { goal, changed: false });
  const theme = useTheme();
  const navigate = useNavigate();
  const globalTheme = useGlobalTheme();
  const { addAlert } = useAlert();

  const { data: usersData, loading: usersLoading } = useGoalUsersQuery({
    variables: { siteId },
    fetchPolicy: "cache-and-network",
    onError
  });
  const { data: goalMetricsData, loading: goalMetricsLoading } = useGoalMetricsQuery({
    fetchPolicy: "cache-and-network",
    onError
  });

  useEffect(() => {
    dispatch({ type: "initialize-goal", payload: { goal } });
  }, [goal]);

  const userOptions = useMemo(() => {
    if (!usersData?.users) return [];
    return sortGroupsAndUsers(usersData.users.filter(isMappedAccessUser));
  }, [usersData]);

  const userValues = useMemo(
    () => selectedUsers(state.goal.userIds, userOptions),
    [state.goal.userIds, userOptions]
  );

  const metricOptions = useMemo(() => {
    if (!goalMetricsData?.pdGoalMetrics) return [];
    return sortArray(goalMetricsData.pdGoalMetrics, true, (metric) => metric.name);
  }, [goalMetricsData]);

  const metricValues = useMemo(
    () => selectedMetrics(state.goal.metricIds, metricOptions),
    [state.goal.metricIds, metricOptions]
  );

  const programNames = useMemo(() => {
    if (!programs) return [];
    return programs.map(({ name }) => name);
  }, [programs]);

  const isComplete = isGoalComplete(state.goal);
  const isNameTaken =
    state.goal.name !== goal.name && programNames.includes(state.goal.name);
  const loading = usersLoading || goalMetricsLoading || saving || providedLoading;

  function goBack() {
    navigate(goBackUrl(siteId));
  }

  function onError() {
    addAlert({
      severity: "error",
      message: "An unexpected error occurred loading Host Goal management"
    });
    goBack();
  }

  function handleSave() {
    if (!isGoalComplete(state.goal) || isNameTaken || loading) return;
    onSave(state.goal);
  }

  return (
    <PageContainer
      data-testid={"goal-builder"}
      rowGap={theme.spacing(2)}
      overflow={"hidden"}
      gridAutoRows={"max-content auto max-content"}
    >
      <Box display={"grid"} rowGap={theme.spacing(3)}>
        <Typography variant={"h1"} fontWeight={700}>
          {title}
        </Typography>
        <Typography variant={"h4"} fontWeight={700}>
          {description}
        </Typography>
      </Box>

      <PageContainerBreakout
        width={"100%"}
        start={"page-start"}
        end={"page-end"}
        sx={{ overflowY: "auto", overflowX: "hidden" }}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          rowGap={theme.spacing(2)}
          px={theme.spacing(8)}
          paddingBottom={theme.spacing(2)}
        >
          <Box display={"flex"}>
            <Typography variant={"bodySmall"} color={globalTheme.colors.grey[600]}>
              GOAL SETTINGS
            </Typography>
            <GoalSettingsHelpTip />
          </Box>

          <Box display={"grid"}>
            <InputLabel>Goal name</InputLabel>
            <TextField
              data-testid={"goal-name-input"}
              value={state.goal.name}
              onChange={(e) =>
                dispatch({ type: "update-name", payload: { name: e.target.value } })
              }
              error={isNameTaken}
              helperText={isNameTaken ? "Goal name already exists" : ""}
              placeholder={"Enter name"}
              autoComplete={"off"}
              disabled={loading}
              inputProps={{ maxLength: 511 }}
            />
          </Box>

          <Box display={"flex"}>
            <DateRangeField
              data-testid={"goal-period"}
              label={"Goal time period"}
              from={state.goal.goalStart}
              to={state.goal.goalEnd}
              maxFrom={state.goal.goalEnd}
              minTo={state.goal.goalStart}
              disabled={loading}
              onFromChange={(value) => {
                dispatch({
                  type: "update-goal-start",
                  payload: { date: value }
                });
              }}
              onToChange={(value) => {
                dispatch({
                  type: "update-goal-end",
                  payload: { date: value }
                });
              }}
            />
          </Box>

          <Box
            display={"flex"}
            width={"100%"}
            columnGap={theme.spacing(3)}
            alignItems={"start"}
          >
            <Box display={"grid"} width={"100%"}>
              <InputLabel
                type={"count"}
                count={state.goal.userIds.length}
                label={"User/s"}
              />
              <UserSelect
                value={userValues}
                options={userOptions}
                disabled={loading}
                onChange={(users) => {
                  dispatch({
                    type: "update-users",
                    payload: { userIds: users.map(({ id }) => id) }
                  });
                }}
              />
            </Box>

            <Box display={"grid"} width={"100%"}>
              <InputLabel
                type={"count"}
                count={state.goal.metricIds.length}
                label={"Metric/s"}
              />
              <CheckboxMultiSelect
                data-testid={"metric-select"}
                value={metricValues}
                options={metricOptions}
                placeholder={"Search and select metric/s"}
                disabled={loading}
                noOptionsText={"No metrics"}
                limitTags={4}
                icon={<LeaderboardRounded sx={{ fill: globalTheme.colors.grey[500] }} />}
                getOptionLabel={(option) => option.name}
                onChange={(metrics) => {
                  dispatch({
                    type: "update-metrics",
                    payload: { metricIds: metrics.map(({ id }) => id) }
                  });
                }}
              />
            </Box>
          </Box>

          {!!userValues.length && !!metricValues.length && (
            <TargetValuesPaper borderStyle={3} elevation={2}>
              <TargetValuesGrid
                users={userValues}
                metrics={metricValues}
                targetValues={state.goal.targetValues}
                disabled={loading}
                onChange={({ colIdx, rowIdx, value }) => {
                  dispatch({
                    type: "update-target-value",
                    payload: {
                      metricIdx: colIdx,
                      userIdx: rowIdx,
                      value: value ? Number(value) : null
                    }
                  });
                }}
              />
            </TargetValuesPaper>
          )}
        </Box>
      </PageContainerBreakout>

      <Box
        display={"grid"}
        gridTemplateColumns={"160px 160px"}
        columnGap={theme.spacing(4)}
        width={"100%"}
        justifyContent={"end"}
        mt={theme.spacing(3)}
      >
        <Button variant={"outlined"} color={"neutral"} disabled={saving} onClick={goBack}>
          Cancel
        </Button>
        <LoadingButton
          variant={"contained"}
          loading={saving}
          disabled={loading || !isComplete || isNameTaken || !state.changed}
          onClick={handleSave}
        >
          {saving ? "Saving" : "Save"}
        </LoadingButton>
      </Box>
    </PageContainer>
  );
}

GoalBuilder.fragments = {
  goalBuilderGoal: gql`
    fragment GoalBuilderGoal on PdGoalProgram {
      id
      name
      startDate
      endDate
      members {
        id
      }
      metrics {
        id
      }
      targets {
        matrix
      }
    }
  `
};

function selectedUsers(
  userIds: string[],
  users: HostGoalUserOptionFragment[]
): HostGoalUserOptionFragment[] {
  return userIds.map((userId) => {
    const userOption = users.find((user) => user.id === userId);

    return userOption ? userOption : { id: userId, firstName: userId, lastName: "" };
  });
}

function selectedMetrics(
  metricIds: string[],
  metrics: GoalBuilderGoalMetricFragment[]
): GoalBuilderGoalMetricFragment[] {
  return metricIds.map((metricId) => {
    const metric = metrics.find(({ id }) => id === metricId);

    return metric ? metric : { id: metricId, name: metricId };
  });
}

function GoalSettingsHelpTip() {
  const line1 =
    "Enter the program information and then enter each goal (a rounded number) in the table it will be display.";
  const line2 = "To add more users, simply select others in the User/s dropdown below.";

  return (
    <HelpTip
      placement={"right-start"}
      title={
        <>
          <span>{line1}</span>
          <br />
          <br />
          <span>{line2}</span>
        </>
      }
      PopperProps={{
        sx: {
          [`& .${tooltipClasses.tooltip}`]: {
            maxWidth: "100%"
          }
        }
      }}
    />
  );
}

const _GOAL_USERS_QUERY = gql`
  fragment GoalBuilderUser on User {
    ...HostGoalUserOption
    pdHostMappings(siteId: $siteId) {
      id
    }
    accessLevel
  }

  query goalUsers($siteId: ID!) {
    users {
      ...GoalBuilderUser
    }
  }
  ${UserSelect.fragments.userOption}
`;

const _GOAL_PROGRAMS_QUERY = gql`
  query goalPrograms($siteId: ID!) {
    pdGoalPrograms(siteId: $siteId) {
      id
      name
    }
  }
`;

const _GOAL_METRICS_QUERY = gql`
  fragment GoalBuilderGoalMetric on PdGoalProgramMetric {
    id
    name
  }

  query goalMetrics {
    pdGoalMetrics {
      ...GoalBuilderGoalMetric
    }
  }
`;
