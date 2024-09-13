import { Box, styled, useTheme } from "@mui/material";
import { Button, Typography } from "@vizexplorer/global-ui-v2";
import { Search } from "../common";
import { useEffect, useMemo, useState } from "react";
import { sortArray } from "../../view/utils";
import { useCurrentUserQuery } from "generated-graphql";
import { gql } from "@apollo/client";
import {
  useGoalProgramDeleteMutation,
  useGoalProgramsLazyQuery,
  useSitesQuery
} from "./__generated__/host-goals";
import { programMatchesSearch, sitesManageableByUser } from "./utils";
import { SiteSelectSiteFragment, SiteSelect } from "view-v2/site-select";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ProgramList } from "./program-list";
import { ProgramActionType } from "./types";
import { ProgramCardProgramFragment } from "./__generated__/program-card";
import { NoSearchResult } from "./no-search-result";
import { NoPrograms } from "./no-programs";
import { PageContainer, NoSiteSelection, SomethingWentWrong } from "view-v2/page";
import { DeleteProgramDialog } from "./dialog";

const NoSearchResultContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  width: "100%",
  marginTop: theme.spacing(4)
}));

const ToolbarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2.5)
}));

export function HostGoals() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);
  const [selectedSite, setSelectedSite] = useState<SiteSelectSiteFragment | null>(null);
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);
  const [deleteProgram, setDeleteProgram] = useState<ProgramCardProgramFragment | null>(
    null
  );

  const {
    data: sitesData,
    loading: sitesLoading,
    refetch: refetchSites
  } = useSitesQuery({ fetchPolicy: "cache-and-network", onError: setError });
  const {
    data: curUserData,
    loading: curUserLoading,
    refetch: refetchCurUser
  } = useCurrentUserQuery({ onError: setError });
  const [
    loadPrograms,
    { data: goalProgramsData, loading: goalProgramsLoading, refetch: refetchGoalPrograms }
  ] = useGoalProgramsLazyQuery({ fetchPolicy: "cache-and-network", onError: setError });
  const [runDeleteProgram, { loading: deletingProgram }] = useGoalProgramDeleteMutation({
    onError: setError
  });

  const loading = sitesLoading || curUserLoading || goalProgramsLoading;
  const programs = goalProgramsData?.pdGoalPrograms || [];

  const sites = useMemo(() => {
    if (!sitesData?.sites || !curUserData?.currentUser) return [];
    const allowedSites = sitesManageableByUser(sitesData.sites, curUserData.currentUser);
    return sortArray(allowedSites || [], true, (site) => site.name);
  }, [sitesData, curUserData]);

  const renderPrograms = useMemo(() => {
    return search
      ? programs.filter((program) => programMatchesSearch(program, search))
      : programs;
  }, [programs, search]);

  useEffect(() => {
    if (sites.length !== 1) return;
    handleSiteChange(sites[0]);
  }, [sites]);

  useEffect(() => {
    const siteIdFromState = searchParams.get("siteId");
    if (siteIdFromState) {
      const site = sites.find((site) => site.id === siteIdFromState);
      if (site) {
        handleSiteChange(site);
      }
    }
  }, [searchParams, sites]);

  function handleSiteChange(site: SiteSelectSiteFragment) {
    loadPrograms({ variables: { siteId: site.id } });
    setSearch("");
    setSelectedSite(site);
  }

  function onClickAddNewProgram() {
    if (!selectedSite) return;
    navigate(`sites/${selectedSite.id}/new`);
  }

  function handleProgramActionClick(
    type: ProgramActionType,
    program: ProgramCardProgramFragment
  ) {
    const navigateTo = (path: string) => {
      if (!selectedSite) return;
      navigate(`sites/${selectedSite.id}/programs/${program.id}/${path}`);
    };

    switch (type) {
      case "name":
        navigateTo("dashboard");
        break;
      case "edit":
        navigateTo("edit");
        break;
      case "duplicate":
        navigateTo("duplicate");
        break;
      case "expand-collapse":
        setExpandedProgramId((cur) => (cur === program.id ? null : program.id));
        break;
      case "delete":
        setDeleteProgram(program);
        break;
    }
  }

  async function handleDeleteProgram(program: ProgramCardProgramFragment) {
    if (!selectedSite) return;
    await runDeleteProgram({
      variables: { input: { id: program.id, siteId: selectedSite.id } }
    });
    refetchGoalPrograms();
    setDeleteProgram(null);
  }

  if (error) {
    return (
      <PageWrapper>
        <SomethingWentWrong
          data-testid={"host-goals-error"}
          onClickRefresh={() => {
            setError(null);
            refetchCurUser();
            refetchSites();
            refetchGoalPrograms();
          }}
        />
      </PageWrapper>
    );
  }

  return (
    <>
      {!!deleteProgram && (
        <DeleteProgramDialog
          programName={deleteProgram.name}
          disabled={deletingProgram}
          onDelete={() => handleDeleteProgram(deleteProgram)}
          onClose={() => setDeleteProgram(null)}
        />
      )}
      <PageWrapper>
        {(selectedSite || !loading) && sites.length > 1 && (
          <SiteSelect selected={selectedSite} sites={sites} onChange={handleSiteChange} />
        )}
        {(loading || (!!selectedSite && !!programs.length)) && (
          <>
            <ToolbarContainer>
              <Search
                data-testid={"host-goals-search"}
                value={search}
                placeholder={"Search"}
                sx={{ width: "250px" }}
                onChange={(e) => setSearch(e.target.value)}
                onClickClose={() => setSearch("")}
                disabled={loading}
              />
              <Button
                disabled={loading}
                data-testid={"add-program-btn"}
                variant={"contained"}
                size={"small"}
                onClick={onClickAddNewProgram}
              >
                Add program
              </Button>
            </ToolbarContainer>
            <ProgramList
              loading={loading}
              programList={renderPrograms}
              expandedProgramId={expandedProgramId}
              handleProgramActionClick={handleProgramActionClick}
            />
          </>
        )}
        {search && !loading && !renderPrograms.length && (
          <NoSearchResultContainer>
            <NoSearchResult search={search} onClickClearSearch={() => setSearch("")} />
          </NoSearchResultContainer>
        )}
        {!loading && !selectedSite && <NoSiteSelection requiredFor={"host goals"} />}
        {!loading && selectedSite && !programs.length && (
          <NoPrograms onClickAddNewProgram={onClickAddNewProgram} />
        )}
      </PageWrapper>
    </>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  return (
    <PageContainer data-testid={"host-goals"} overflow={"auto"}>
      <Typography gutterBottom variant={"h1"} fontWeight={700} mb={theme.spacing(3)}>
        Host Goals
      </Typography>
      {children}
    </PageContainer>
  );
}

const _SITES_QUERY = gql`
  query sites {
    sites {
      ...SiteSelectSite
    }
  }
  ${SiteSelect.fragments.siteSelectSite}
`;

const _GOAL_PROGRAMS_QUERY = gql`
  query goalPrograms($siteId: ID!) {
    pdGoalPrograms(siteId: $siteId) {
      ...ProgramCardProgram
    }
  }
  ${ProgramList.fragments.programCardProgram}
`;

const _DELETE_PROGRAM_MUTATION = gql`
  mutation goalProgramDelete($input: PdGoalProgramDeleteInput!) {
    pdGoalProgramDelete(input: $input)
  }
`;
