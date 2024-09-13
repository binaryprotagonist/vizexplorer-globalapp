import { useCurrentUserQuery } from "generated-graphql";
import { useNavigate, useParams } from "react-router-dom";
import {
  CompletedReducerGoal,
  ReducerGoal,
  createReducerGoal
} from "./manage-goal-reducer";
import { GoalBuilder } from "./goal-builder/goal-builder";
import { gql } from "@apollo/client";
import {
  GoalProgramsQuery,
  useGoalProgramCreateMutation,
  useGoalProgramsLazyQuery
} from "./__generated__/host-goal-create";
import {
  reducerGoalAsGoalCreateInput,
  goBackUrl,
  sitesWithPermission,
  duplicateBuilderGoalAsReducerGoal
} from "./utils";
import { useEffect, useState } from "react";
import { useAlert } from "view-v2/alert";

type Params = {
  siteId: string;
  // for duplication
  programId?: string;
};

export function HostGoalCreate() {
  const [goal, setGoal] = useState<ReducerGoal>(createReducerGoal());
  const navigate = useNavigate();
  const { addAlert } = useAlert();
  const { siteId, programId } = useParams<Params>() as Params;

  const { data: curUserData, loading: curUserLoading } = useCurrentUserQuery({
    onError: () => {
      navigate(goBackUrl());
    }
  });
  const [
    loadPrograms,
    { data: programsData, loading: programsLoading, called: programsCalled }
  ] = useGoalProgramsLazyQuery({
    fetchPolicy: "cache-and-network",
    onCompleted: handleGoalsLoaded,
    onError: onQueryError
  });

  const [createGoal, { loading: creatingGoal }] = useGoalProgramCreateMutation({
    onCompleted: (data) => {
      if (!data.pdGoalProgramCreate) return;
      addAlert({
        severity: "success",
        message: `${data.pdGoalProgramCreate.name} added`
      });
      navigate(goBackUrl(siteId));
    },
    onError: () => {
      addAlert({
        severity: "error",
        message: "An unexpected error occurred while saving. Please try again."
      });
    }
  });

  const currentUser = curUserData?.currentUser;
  const accessibleSites = currentUser ? sitesWithPermission(currentUser) : [];
  const targetSite = accessibleSites.find((site) => site.id === siteId);

  useEffect(() => {
    if (!targetSite) return;
    loadPrograms({ variables: { siteId } });
  }, [targetSite?.id]);

  if (curUserLoading) return null;

  if (!targetSite) {
    navigate(goBackUrl());
    return null;
  }

  function handleGoalSave(goal: CompletedReducerGoal) {
    createGoal({
      variables: { input: reducerGoalAsGoalCreateInput(goal, siteId) }
    });
  }

  // find goal to duplicate from provided programId, or early return if creating a new goal
  function handleGoalsLoaded(data: GoalProgramsQuery) {
    if (!programId) return;

    const programs = data.pdGoalPrograms;
    const targetGoal = programs.find((program) => program.id === programId);

    if (targetGoal) {
      setGoal(duplicateBuilderGoalAsReducerGoal(targetGoal));
    } else {
      addAlert({
        severity: "error",
        message: `Could not find program with id ${programId} for site ${siteId}`
      });
      navigate(goBackUrl());
    }
  }

  function onQueryError() {
    navigate(goBackUrl());
  }

  return (
    <>
      <span data-testid={"host-goal-create"} />
      <GoalBuilder
        title={"Host Goals"}
        description={description(targetSite.name, accessibleSites.length)}
        goal={goal}
        programs={programsData?.pdGoalPrograms || []}
        siteId={siteId}
        saving={creatingGoal}
        loading={!!programId && (!programsCalled || programsLoading)}
        onSave={handleGoalSave}
      />
    </>
  );
}

function description(siteName: string, numSites: number) {
  return `Create a new goal program${numSites > 1 ? ` for ${siteName}` : ""}`;
}

const _GOAL_PROGRAMS_QUERY = gql`
  query goalPrograms($siteId: ID!) {
    pdGoalPrograms(siteId: $siteId) {
      ...GoalBuilderGoal
    }
  }
  ${GoalBuilder.fragments.goalBuilderGoal}
`;

const _GOAL_PROGRAM_CREATE_MUTATION = gql`
  mutation goalProgramCreate($input: PdGoalProgramCreateInput!) {
    pdGoalProgramCreate(input: $input) {
      id
      name
      startDate
      endDate
      status
      site {
        id: idV2
      }
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
  }
`;
