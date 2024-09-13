import { Box, useTheme } from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { Typography, useGlobalTheme } from "@vizexplorer/global-ui-v2";
import { TargetValuesGrid } from "./target-values-grid";
import { gql } from "@apollo/client";
import { ProgramCardProgramDetailFragment } from "./__generated__/program-detail";
import { formatDateString } from "./utils";

type ProgramDetailProps = {
  programDetail: ProgramCardProgramDetailFragment;
};

export function ProgramDetail({ programDetail }: ProgramDetailProps) {
  const theme = useTheme();
  const globalTheme = useGlobalTheme();
  const { startDate, endDate, members, metrics, targets } = programDetail;
  const matrixValues = targets?.matrix ?? defaultMatrix(members.length, metrics.length);

  return (
    <Box data-testid={"program-detail"} display={"flex"} flexDirection={"column"}>
      <Box display={"flex"} p={theme.spacing(2, 3)}>
        <CalendarMonthRoundedIcon sx={{ fill: globalTheme.colors.grey[500] }} />
        <Typography data-testid={"program-date-range"} variant={"bodySmall"} mx={1}>
          {formatDateString(startDate)} - {formatDateString(endDate)}
        </Typography>
      </Box>

      <TargetValuesGrid
        readOnly
        users={members}
        metrics={metrics}
        targetValues={matrixValues}
      />
    </Box>
  );
}

ProgramDetail.fragments = {
  programDetail: gql`
    fragment ProgramCardProgramDetail on PdGoalProgram {
      startDate
      endDate
      members {
        ...TargetValuesUser
      }
      metrics {
        ...TargetValuesMetric
      }
      targets {
        ...TargetValuesTargetMatrix
      }
    }
    ${TargetValuesGrid.fragments.user}
    ${TargetValuesGrid.fragments.metric}
    ${TargetValuesGrid.fragments.targetMatrix}
  `
};

function defaultMatrix(numUsers: number, numMetrics: number) {
  return Array.from({ length: numUsers }, () => Array(numMetrics).fill(0));
}
