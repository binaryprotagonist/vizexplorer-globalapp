import { Box, styled } from "@mui/material";
import { Button, LoadingButton, TextField } from "@vizexplorer/global-ui-v2";
import { InputLabel } from "view-v2/input-label";
import {
  ManageMarketingListReducerAction,
  ManageMarketingListReducerState
} from "../../reducer";
import { Dispatch } from "react";
import { GuestsCriteria } from "./guests-criteria";
import { emptyGuestListBuilderReducerState } from "../../reducer/guest-list-builder-reducer";

const ContentContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%"
});

const OverflowContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflow: "auto",
  padding: theme.spacing(0, 8)
}));

const FooterContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "160px 160px",
  columnGap: theme.spacing(4),
  width: "100%",
  justifyContent: "end",
  marginTop: theme.spacing(3),
  padding: theme.spacing(0, 8)
}));

type Props = {
  state: ManageMarketingListReducerState;
  continuing?: boolean;
  disabled?: boolean;
  isNameTaken?: boolean;
  dispatch: Dispatch<ManageMarketingListReducerAction>;
  onClickCancel?: VoidFunction;
  onClickContinue?: VoidFunction;
};

export function CreateGuestList({
  state,
  continuing,
  disabled,
  isNameTaken = false,
  dispatch,
  onClickCancel,
  onClickContinue
}: Props) {
  const disableAllButCancel = continuing || disabled;
  const disableCancel = continuing;

  return (
    <ContentContainer
      data-testid={"create-guest-list"}
      data-loading={`${disableAllButCancel || disableCancel}`}
    >
      <OverflowContainer>
        <Box display={"grid"}>
          <InputLabel help={<NameHelperText />}>Name</InputLabel>
          <TextField
            data-testid={"name-input"}
            value={state.marketingList.name}
            placeholder={"Enter name"}
            autoComplete={"off"}
            disabled={disableAllButCancel}
            error={isNameTaken}
            helperText={isNameTaken ? "Marketing List name already exists" : ""}
            inputProps={{ maxLength: 511 }}
            onChange={(e) => {
              dispatch({ type: "update-name", payload: { name: e.target.value } });
            }}
          />
        </Box>

        <Box mt={3}>
          <GuestsCriteria initialState={emptyGuestListBuilderReducerState()} />
        </Box>
        <Button
          variant={"outlined"}
          color={"neutral"}
          disabled={disableCancel}
          onClick={onClickCancel}
        >
          Add an `&ldquo;`or`&ldquo;` condition
        </Button>
      </OverflowContainer>

      <FooterContainer>
        <Button
          variant={"outlined"}
          color={"neutral"}
          disabled={disableCancel}
          onClick={onClickCancel}
        >
          Cancel
        </Button>
        <LoadingButton
          data-testid={"continue-btn"}
          variant={"contained"}
          loading={continuing}
          // TODO always disabled until criteria is complete
          disabled={true || disableAllButCancel}
          onClick={onClickContinue}
        >
          {continuing ? "Loading" : "Continue"}
        </LoadingButton>
      </FooterContainer>
    </ContentContainer>
  );
}

function NameHelperText() {
  return (
    <>
      {"Give it a name to save it for future use."}
      <br />
      {"You'll be able to duplicate it."}
    </>
  );
}
