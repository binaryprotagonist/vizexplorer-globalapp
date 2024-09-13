import { gql } from "@apollo/client";
import { Box, useTheme } from "@mui/material";
import { Typography } from "@vizexplorer/global-ui-v2";
import { SisenseDashboardProvider } from "view-v2/sisense";
import { IndividualPerformanceMetricFragment } from "./__generated__/individual-performance";
import { DynamicWidgetMissing, SisenseWidget, WidgetCard } from "view-v2/dynamic-widget";

type Props = {
  dashboardId: string;
  siteId: string;
  metrics: IndividualPerformanceMetricFragment[];
  cardHeight?: string | number;
};

export function IndividualPerformance({
  dashboardId,
  siteId,
  metrics,
  cardHeight = 250
}: Props) {
  const theme = useTheme();

  return (
    <SisenseDashboardProvider dashboardId={dashboardId} siteId={siteId}>
      <Box
        data-testid={"individual-performance"}
        display={"flex"}
        flexDirection={"column"}
        rowGap={theme.spacing(2)}
      >
        <Typography variant={"h3"} fontWeight={500}>
          Individual performance
        </Typography>

        <Box display={"grid"} gridTemplateColumns={"1fr 1fr"} gap={theme.spacing(2)}>
          {metrics.map((metric) => (
            <WidgetCard key={metric.name} data-testid={"widget"} height={cardHeight}>
              {!metric.sisenseIndividualWidget ? (
                <DynamicWidgetMissing title={metric.id} />
              ) : (
                <SisenseWidget
                  id={metric.sisenseIndividualWidget.id}
                  title={metric.name}
                />
              )}
            </WidgetCard>
          ))}
        </Box>
      </Box>
    </SisenseDashboardProvider>
  );
}

IndividualPerformance.fragments = {
  individualPerformanceMetric: gql`
    fragment IndividualPerformanceMetric on PdGoalProgramMetric {
      id
      name
      sisenseIndividualWidget {
        id
      }
    }
  `
};
