import { useEffect, useMemo, useReducer } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import { BlueCardHeader, Card } from "../../../../../view/card";
import { SubscriptionReducerState } from "./reducer/types";
import {
  SubscriptionCreateInput,
  useApplicationSubscriptionsQuery,
  useSubscriptionCreateMutation,
  useSubscriptionPlansQuery
} from "generated-graphql";
import { useNavigate } from "react-router-dom";
import { subscriptionReducer } from "./reducer";
import { findAvailablePlans, isFormValid, subscriptionPlanFromForm } from "./utils";
import { SubscriptionForm } from "../../shared/form/subscription-form";
import { startOfToday } from "date-fns";
import { FormChangeAction, FormOptions, FormValues } from "../../shared";

const initialFormState: SubscriptionReducerState = {
  values: {
    appId: null,
    environment: null,
    billingInterval: null,
    packageType: null,
    expirationDate: null
  },
  options: {
    applicationOptions: [],
    billingIntervalOptions: [],
    environmentOptions: [],
    expireDateOptions: { min: startOfToday() },
    packageTypeOptions: []
  }
};

export function AddSubscription() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(subscriptionReducer, initialFormState);

  const {
    data: appsData,
    loading: appsLoading,
    error: appsErr
  } = useApplicationSubscriptionsQuery();
  const {
    data: subsData,
    loading: subsLoading,
    error: subsErr
  } = useSubscriptionPlansQuery();
  const [
    createSubscription,
    { loading: subscriptionCreating, error: subscriptionCreateErr }
  ] = useSubscriptionCreateMutation();

  // plans which the org doesn't already have an active subscription to
  const availablePlans = useMemo(() => {
    if (!subsData?.subscriptionPlans || !appsData?.appSubscriptions) return [];
    return findAvailablePlans(subsData.subscriptionPlans, appsData.appSubscriptions);
  }, [subsData?.subscriptionPlans, appsData?.appSubscriptions]);

  useEffect(() => {
    dispatch({ type: "build-app-options", payload: availablePlans });
  }, [availablePlans]);

  async function onFormSubmit(form: FormValues, options: FormOptions) {
    if (!isFormValid(form, options)) {
      return;
    }
    const subscriptionPlans = subsData!.subscriptionPlans!;
    const plan = subscriptionPlanFromForm(form, subscriptionPlans);
    const input: SubscriptionCreateInput = {
      planId: plan.id,
      periodEndDate: form.expirationDate
    };
    await createSubscription({ variables: { input } });
    navigate("..");
  }

  function onFormChange(action: FormChangeAction) {
    switch (action.field) {
      case "application":
        dispatch({
          type: `${action.field}-change`,
          payload: { appId: action.value, plans: availablePlans }
        });
        return;
      case "billing-interval":
        dispatch({ type: `${action.field}-change`, payload: action.value });
        return;
      case "environment":
        dispatch({ type: `${action.field}-change`, payload: action.value });
        return;
      case "package-type":
        dispatch({ type: `${action.field}-change`, payload: action.value });
        return;
      case "expiration-date":
        dispatch({ type: `${action.field}-change`, payload: action.value });
        return;
    }
  }

  if (subsErr) throw subsErr;
  if (appsErr) throw appsErr;
  if (subscriptionCreateErr) throw subscriptionCreateErr;

  return (
    <>
      <span data-testid={"add-subscription"} />
      <Box padding={theme.spacing(6, 3)} flex={1} minWidth={360} overflow={"auto"}>
        <Card sx={{ maxWidth: "500px", margin: "0 auto" }}>
          <BlueCardHeader>
            <Typography variant={"h4"} align={"center"}>
              Add Subscription
            </Typography>
          </BlueCardHeader>
          <Box padding={theme.spacing(4)}>
            <Box marginBottom={theme.spacing(4)}>
              <Typography
                variant={"h6"}
                align={"center"}
                color={"hsla(222, 8%, 30%, 0.7)"}
              >
                Please Enter Subscription Information
              </Typography>
            </Box>
            <Box>
              <SubscriptionForm
                state={state.values}
                options={state.options}
                onChange={onFormChange}
                onSubmit={onFormSubmit}
                onCancel={() => navigate("..")}
                loading={appsLoading || subsLoading}
                disabled={subscriptionCreating}
              />
            </Box>
          </Box>
        </Card>
      </Box>
    </>
  );
}
