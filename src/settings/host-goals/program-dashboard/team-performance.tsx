import { Box, useTheme } from "@mui/material";
import { Typography } from "@vizexplorer/global-ui-v2";
import { CarouselItem, HorizontalCarousel } from "view-v2/carousel";
import { gql } from "@apollo/client";
import { TeamPerformanceMetricFragment } from "./__generated__/team-performance";
import { SisenseDashboardProvider } from "view-v2/sisense";
import { DynamicWidgetMissing, SisenseWidget, WidgetCard } from "view-v2/dynamic-widget";

type Props = {
  dashboardId: string;
  siteId: string;
  metrics: TeamPerformanceMetricFragment[];
  cardHeight?: string | number;
  slidesPerView?: number;
};

export function TeamPerformance({
  dashboardId,
  siteId,
  metrics,
  cardHeight = "165px",
  slidesPerView = 6
}: Props) {
  const theme = useTheme();

  return (
    <SisenseDashboardProvider dashboardId={dashboardId} siteId={siteId}>
      <Box
        data-testid={"team-performance"}
        display={"flex"}
        flexDirection={"column"}
        rowGap={theme.spacing(2)}
      >
        <Typography variant={"h3"} fontWeight={500}>
          Team performance
        </Typography>

        <HorizontalCarousel slidesPerView={slidesPerView}>
          {metrics.map((metric) => (
            <CarouselItem key={metric.name}>
              <WidgetCard data-testid={"widget"} height={cardHeight}>
                {!metric.sisenseTeamWidget ? (
                  <DynamicWidgetMissing title={metric.id} />
                ) : (
                  <SisenseWidget id={metric.sisenseTeamWidget.id} title={metric.name} />
                )}
              </WidgetCard>
            </CarouselItem>
          ))}
        </HorizontalCarousel>
      </Box>
    </SisenseDashboardProvider>
  );
}

TeamPerformance.fragments = {
  teamPerformanceMetric: gql`
    fragment TeamPerformanceMetric on PdGoalProgramMetric {
      id
      name
      sisenseTeamWidget {
        id
      }
    }
  `
};
