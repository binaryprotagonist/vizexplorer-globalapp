import { Box, styled } from "@mui/material";
import { InputLabel } from "view-v2/input-label";
import { Autocomplete } from "@vizexplorer/global-ui-v2";
import { AutocompleteRenderInputParams } from "@mui/material";
import { TextField } from "@vizexplorer/global-ui-v2";
import { IconButton, IconButtonProps } from "view-v2/icon-button";
import { ReducerAction, DraftSubscriptionState } from "./reducer";
import { Dispatch, useMemo } from "react";
import { ApplicationSelect } from "./application-select";
import { CheckmarkOption } from "view-v2/select/components/checkmark-option";
import { DesktopDatePicker } from "view-v2/date-picker";
import { SubBuilderSubPlanFragment } from "./__generated__/subscription-builder";
import { ApplicationSelectAppFragment } from "./__generated__/application-select";
import { AppId } from "generated-graphql";
import { sortArray } from "../../../view/utils";
import { capitalize } from "../../../view/utils/capitalize";
import { displayBillingInterval } from "../utils";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { applicationSelectAppFragmentFromPlan } from "./utils";

const DraftSubscriptionContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "showDelete"
})<{ showDelete?: boolean }>(({ theme, showDelete }) => ({
  ...(showDelete && {
    display: "grid",
    gridTemplateColumns: "auto max-content",
    alignItems: "center",
    columnGap: showDelete ? theme.spacing(2.5) : 0
  })
}));

const FieldsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3)
}));

const FieldContainer = styled(Box)({
  display: "flex",
  flexDirection: "column"
});

const DualFieldContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(4)
}));

type Props = {
  index: number;
  draftState: DraftSubscriptionState;
  subPlans: SubBuilderSubPlanFragment[];
  disabled?: boolean;
  showDelete?: boolean;
  dispatch: Dispatch<ReducerAction>;
};

export function DraftSubscription({
  index,
  draftState,
  subPlans,
  disabled = false,
  showDelete = false,
  dispatch
}: Props) {
  const { draftSubscription, options } = draftState;

  const selectedApp = useMemo(
    () => applicationSelectAppFragmentFromPlan(draftSubscription.appId, subPlans),
    [draftSubscription.appId, subPlans]
  );
  const sortedAppOptions = useMemo(() => {
    const appOptions = draftState.options.applications
      .map((appId) => applicationSelectAppFragmentFromPlan(appId, subPlans))
      .filter((app): app is ApplicationSelectAppFragment => !!app);
    return sortArray(appOptions, true, (app) => app.name);
  }, [draftState.options.applications, subPlans]);

  return (
    <DraftSubscriptionContainer
      data-testid={"draft-subscription"}
      showDelete={showDelete}
    >
      <FieldsContainer>
        <DualFieldContainer>
          <FieldContainer data-testid={"application"}>
            <InputLabel>Application subscription</InputLabel>
            <ApplicationSelect
              selected={selectedApp}
              options={sortedAppOptions}
              disabled={disabled}
              onChange={(app) => {
                dispatch({
                  type: "UPDATE_APP",
                  payload: { subIdx: index, appId: app.id as AppId }
                });
              }}
            />
          </FieldContainer>

          <FieldContainer data-testid={"package-type"}>
            <InputLabel>Subscription type</InputLabel>
            <Autocomplete
              data-testid={"package-type-select"}
              disableClearable
              // @ts-ignore allow null
              value={draftSubscription.packageType ?? null}
              options={options.packageTypes}
              disabled={
                disabled ||
                (!!draftSubscription.packageType && options.packageTypes.length === 1)
              }
              getOptionLabel={capitalize}
              renderOption={(props, option, state) => (
                <CheckmarkOption
                  {...props}
                  option={capitalize(option)}
                  selected={state.selected}
                />
              )}
              onChange={(_, newValue) => {
                dispatch({
                  type: "UPDATE_PACKAGE_TYPE",
                  payload: { subIdx: index, packageType: newValue }
                });
              }}
              renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField {...params} placeholder="Select subscription type" />
              )}
            />
          </FieldContainer>
        </DualFieldContainer>

        <DualFieldContainer>
          <FieldContainer data-testid={"billing-interval"}>
            <InputLabel>Subscription term</InputLabel>
            <Autocomplete
              data-testid={"billing-interval-select"}
              disableClearable
              // @ts-ignore allow null
              value={draftSubscription.billingInterval ?? null}
              options={options.billingIntervals}
              disabled={
                disabled ||
                (!!draftSubscription.billingInterval &&
                  options.billingIntervals.length === 1)
              }
              getOptionLabel={displayBillingInterval}
              renderOption={(props, option, state) => (
                <CheckmarkOption
                  {...props}
                  option={displayBillingInterval(option)}
                  selected={state.selected}
                />
              )}
              onChange={(_, newValue) => {
                dispatch({
                  type: "UPDATE_BILLING_INTERVAL",
                  payload: { subIdx: index, billingInterval: newValue }
                });
              }}
              renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField {...params} placeholder={"Select term"} />
              )}
            />
          </FieldContainer>

          <FieldContainer data-testid={"expiration-date"}>
            <InputLabel>Contract expiration date</InputLabel>
            <DesktopDatePicker
              value={draftSubscription.expirationDate}
              minDate={options.minExpireDate}
              disabled={disabled || !draftSubscription.billingInterval}
              format={"dd MMMM yyyy"}
              slotProps={{
                textField: {
                  InputProps: {
                    placeholder: "Select date",
                    // @ts-ignore allow data-testid
                    "data-testid": "expiration-date-select"
                  }
                }
              }}
              onChange={(value) => {
                dispatch({
                  type: "UPDATE_EXPIRATION_DATE",
                  payload: { subIdx: index, expirationDate: value }
                });
              }}
            />
          </FieldContainer>
        </DualFieldContainer>
      </FieldsContainer>

      {showDelete && (
        <DeleteSubscription
          onClick={() => {
            dispatch({ type: "DELETE_SUBSCRIPTION", payload: { subIdx: index } });
          }}
        />
      )}
    </DraftSubscriptionContainer>
  );
}

function DeleteSubscription(props: IconButtonProps) {
  return (
    <IconButton {...props} data-testid={"delete-subscription"}>
      <DeleteRoundedIcon />
    </IconButton>
  );
}
