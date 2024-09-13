import { Box, styled, useTheme } from "@mui/material";
import { Button, LoadingButton } from "@vizexplorer/global-ui-v2";
import { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import { SubscriptionBuilder } from "view-v2/subscription/add-subscription";
import { SubBuilderSubPlanFragment } from "view-v2/subscription/add-subscription/__generated__/subscription-builder";
import {
  ReducerState,
  addSubscriptionReducer
} from "view-v2/subscription/add-subscription/reducer";

const StyledForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  overflow: "hidden"
});

const ActionsContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "160px 160px",
  columnGap: theme.spacing(4),
  justifyContent: "end",
  margin: theme.spacing(2, 4, 4, 4)
}));

type Props = {
  initialFormState: ReducerState;
  subscriptionPlans: SubBuilderSubPlanFragment[];
  loading?: boolean;
  saving?: boolean;
  onSubmit?: (form: ReducerState) => void;
  onSkip?: VoidFunction;
};

export function AddSubscriptionForm({
  initialFormState,
  subscriptionPlans,
  loading,
  saving,
  onSubmit,
  onSkip
}: Props) {
  const theme = useTheme();
  const [state, dispatch] = useImmerReducer(addSubscriptionReducer, initialFormState);

  useEffect(() => {
    dispatch({ type: "INITIALIZE", payload: { availablePlans: subscriptionPlans } });
  }, [subscriptionPlans]);

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.canSave) {
      onSubmit?.(state);
    }
  }

  return (
    <StyledForm data-testid={"add-subscription-form"} onSubmit={handleFormSubmit}>
      <Box display={"flex"} overflow={"auto"} p={theme.spacing(2, 4)}>
        <SubscriptionBuilder
          state={state}
          disabled={loading || saving}
          dispatch={dispatch}
        />
      </Box>

      <ActionsContainer>
        <Button disabled={saving} variant={"outlined"} color={"neutral"} onClick={onSkip}>
          Skip
        </Button>
        <LoadingButton
          data-testid={"save-button"}
          disabled={!state.canSave || loading || saving}
          variant={"contained"}
          type={"submit"}
        >
          {!saving && "Save"}
        </LoadingButton>
      </ActionsContainer>
    </StyledForm>
  );
}

AddSubscriptionForm.fragments = {
  ...SubscriptionBuilder.fragments
};
