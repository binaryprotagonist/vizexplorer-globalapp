import { useCurrentUserQuery } from "generated-graphql";
import {
  builderGoalAsReducerGoal,
  goBackUrl,
  reducerGoalAsGoalUpdateInput,
  sitesWithPermission
} from "./utils";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "view-v2/alert";
import { GoalBuilder } from "./goal-builder/goal-builder";
import {
  CompletedReducerGoal,
  ReducerGoal,
  createReducerGoal
} from "./manage-goal-reducer";
import { gql } from "@apollo/client";
import {
  GoalProgramsQuery,
  useGoalProgramUpdateMutation,
  useGoalProgramsLazyQuery
} from "./__generated__/host-goal-edit";
import { useEffect, useState } from "react";

type Params = {
  siteId: string;
  programId: string;
};

export function HostGoalEdit() {
  const [goal, setGoal] = useState<ReducerGoal>(createReducerGoal());

  const navigate = useNavigate();
  const { addAlert } = useAlert();
  const { siteId, programId } = useParams<Params>() as Params;

  const { data: curUserData, loading: curUserLoading } = useCurrentUserQuery({ onError });
  const [
    loadPrograms,
    { data: programsData, loading: programsLoading, called: programsCalled }
  ] = useGoalProgramsLazyQuery({
    fetchPolicy: "cache-and-network",
    onCompleted: handleGoalsLoaded,
    onError
  });

  const [updateGoal, { loading: updatingGoal }] = useGoalProgramUpdateMutation({
    onCompleted: (data) => {
      if (!data.pdGoalProgramUpdate) return;
      addAlert({
        severity: "success",
        message: `${data.pdGoalProgramUpdate.name} updated`
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
    updateGoal({
      variables: { input: reducerGoalAsGoalUpdateInput(goal, programId, siteId) }
    });
  }

  function handleGoalsLoaded(data: GoalProgramsQuery) {
    const programs = data.pdGoalPrograms;
    const targetGoal = programs.find((program) => program.id === programId);

    if (targetGoal) {
      setGoal(builderGoalAsReducerGoal(targetGoal));
    } else {
      addAlert({
        severity: "error",
        message: `Could not find program with id ${programId} for site ${siteId}`
      });
      navigate(goBackUrl());
    }
  }

  function onError() {
    navigate(goBackUrl());
  }

  return (
    <>
      <span data-testid={"host-goal-edit"} />
      <GoalBuilder
        title={"Host Goals"}
        description={description(targetSite.name, accessibleSites.length)}
        goal={goal}
        programs={programsData?.pdGoalPrograms || []}
        siteId={siteId}
        saving={updatingGoal}
        loading={!programsCalled || programsLoading}
        onSave={handleGoalSave}
      />
    </>
  );
}

function description(siteName: string, numSites: number) {
  return `Edit goal program${numSites > 1 ? ` for ${siteName}` : ""}`;
}

const _GOAL_PROGRAMS_QUERY = gql`
  query goalPrograms($siteId: ID!) {
    pdGoalPrograms(siteId: $siteId) {
      ...GoalBuilderGoal
    }
  }
  ${GoalBuilder.fragments.goalBuilderGoal}
`;

const _GOAL_PROGRAM_UPDATE_MUTATION = gql`
  mutation goalProgramUpdate($input: PdGoalProgramUpdateInput!) {
    pdGoalProgramUpdate(input: $input) {
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
