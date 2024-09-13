import { Box, CircularProgress, useTheme } from "@mui/material";
import { Button, Typography } from "@vizexplorer/global-ui-v2";
import ArrowBackIosNewRounded from "@mui/icons-material/ArrowBackIosNewRounded";
import { useNavigate, useParams } from "react-router-dom";
import { useCurrentUserQuery } from "generated-graphql";
import { PageContainer } from "view-v2/page";
import { gql } from "@apollo/client";
import { useDashboardProgramLazyQuery } from "./__generated__/program-dashboard";
import { useEffect } from "react";
import { useAlert } from "view-v2/alert";
import { ProgramDashboardHeader } from "./program-dashboard-header";
import { TeamPerformance } from "./team-performance";
import { useSisense } from "view-v2/sisense";
import { sitesWithPermission } from "./utils";
import { IndividualPerformance } from "./individual-performance";

type Params = {
  siteId: string;
  programId: string;
};

// prefer default export with no re-export via index as this method creates a named file in build (program-dashboard-[hash].js) instead of `index-[hash].js`
export default function ProgramDashboard() {
  const { siteId, programId } = useParams<Params>() as Params;
  const { ready: sisenseReady } = useSisense();
  const { addAlert } = useAlert();
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: curUserData, loading: curUserLoading } = useCurrentUserQuery({
    onError: goBack
  });
  const [
    loadProgram,
    { data: goalProgramData, loading: programLoading, called: programCalled }
  ] = useDashboardProgramLazyQuery({
    onCompleted: (data) => {
      if (!data.pdGoalProgram) {
        addAlert({
          severity: "error",
          message: `Could not find program with id ${programId} for site ${siteId}`
        });
        goBack();
      }
    },
    onError: goBack
  });

  const currentUser = curUserData?.currentUser;
  const accessibleSites = currentUser ? sitesWithPermission(currentUser) : [];
  const targetSite = accessibleSites.find((site) => site.id === siteId);
  const program = goalProgramData?.pdGoalProgram;
  const teamDashboardId = program?.sisenseDashboardTeamPerformance?.id;
  const individualDashboardId = program?.sisenseDashboardIndividualPerformance?.id;
  const metrics = program?.metrics ?? [];
  const loading = !sisenseReady || curUserLoading || programLoading || !programCalled;

  useEffect(() => {
    if (!targetSite) return;
    loadProgram({ variables: { programId, siteId: targetSite.id } });
  }, [targetSite?.id]);

  useEffect(() => {
    if (!curUserLoading && !targetSite) {
      goBack();
    }
  }, [curUserLoading, targetSite]);

  function goBack() {
    navigate(`..?siteId=${siteId}`);
  }

  if (!loading && !targetSite) {
    return null;
  }

  return (
    <PageContainer data-testid={"program-dashboard"} overflow={"auto"}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        rowGap={theme.spacing(4)}
        overflow={"hidden"}
      >
        <Box>
          <Button
            variant={"outlined"}
            color={"neutral"}
            size={"small"}
            onClick={goBack}
            startIcon={<ArrowBackIosNewRounded />}
            sx={{ mb: theme.spacing(3.5) }}
          >
            Go back
          </Button>

          <Typography variant={"h1"} fontWeight={700}>
            Program Dashboard
          </Typography>
        </Box>

        {!loading && !!program && targetSite && (
          <ProgramDashboardHeader meta={program} siteName={targetSite.name} />
        )}

        <Box display={"flex"} flexDirection={"column"} rowGap={theme.spacing(2)}>
          {loading && <ProgramLoading />}

          {!loading && teamDashboardId && (
            <TeamPerformance
              dashboardId={teamDashboardId}
              siteId={siteId}
              metrics={metrics}
            />
          )}

          {!loading && individualDashboardId && (
            <IndividualPerformance
              dashboardId={individualDashboardId}
              siteId={siteId}
              metrics={metrics}
            />
          )}
        </Box>
      </Box>
    </PageContainer>
  );
}

const _DASHBOARD_GOAL_PROGRAMS_QUERY = gql`
  fragment ProgramDashboardProgram on PdGoalProgram {
    id
    ...ProgramDashboardHeaderMeta
    sisenseDashboardTeamPerformance {
      id
    }
    sisenseDashboardIndividualPerformance {
      id
    }
    metrics {
      ...TeamPerformanceMetric
      ...IndividualPerformanceMetric
    }
  }
  ${ProgramDashboardHeader.fragments.headerMeta}
  ${TeamPerformance.fragments.teamPerformanceMetric}
  ${IndividualPerformance.fragments.individualPerformanceMetric}

  query dashboardProgram($programId: ID!, $siteId: ID!) {
    pdGoalProgram(programId: $programId, siteId: $siteId) {
      ...ProgramDashboardProgram
    }
  }
`;

function ProgramLoading() {
  return (
    <Box data-testid={"program-loading"} m={"auto"} mt={"10vh"} textAlign={"center"}>
      <CircularProgress size={"92px"} sx={{ mb: "16px" }} />
      <Typography variant={"bodyLarge"} fontWeight={600} width={"200px"}>
        Loading program and metrics...
      </Typography>
    </Box>
  );
}
