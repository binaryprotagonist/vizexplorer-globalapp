import { Box, styled } from "@mui/material";
import { Button } from "@vizexplorer/global-ui-v2";
import { AddRounded } from "@mui/icons-material";
import { Dispatch } from "react";
import { DraftSubscription } from "./draft-subscription";
import { ReducerState, ReducerAction } from "./reducer";
import { EnvironmentField } from "./environment-field";
import { gql } from "@apollo/client";

const DraftSubscriptionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(5),
  margin: theme.spacing(3, 0)
}));

type Props = {
  state: ReducerState;
  disabled?: boolean;
  loading?: boolean;
  dispatch: Dispatch<ReducerAction>;
};

export function SubscriptionBuilder({ state, disabled, loading, dispatch }: Props) {
  return (
    <Box data-testid={"subscription-builder"}>
      <EnvironmentField
        selected={state.environment}
        options={state.environmentOptions}
        disabled={disabled || loading}
        onChange={(environment) => {
          dispatch({ type: "UPDATE_ENVIRONMENT", payload: { environment } });
        }}
      />

      <DraftSubscriptionsContainer>
        {state.draftSubscriptions.map((draftSubscription, index) => (
          <DraftSubscription
            key={`${draftSubscription.draftSubscription.appId}-${index}`}
            index={index}
            draftState={draftSubscription}
            subPlans={state.availablePlans}
            disabled={!state.environment || disabled}
            showDelete={index > 0}
            dispatch={dispatch}
          />
        ))}
      </DraftSubscriptionsContainer>

      <Button
        variant={"text"}
        color={"neutral"}
        startIcon={<AddRounded />}
        disabled={!state.canAddSubscription || disabled || loading}
        onClick={() => {
          dispatch({ type: "ADD_SUBSCRIPTION" });
        }}
      >
        Add another subscription
      </Button>
    </Box>
  );
}

SubscriptionBuilder.fragments = {
  subBuilderSubPlan: gql`
    fragment SubBuilderSubPlan on SubscriptionPlan {
      id
      appId
      appName
      icon
      isOnprem
      package
      billingInterval
    }
  `
};
