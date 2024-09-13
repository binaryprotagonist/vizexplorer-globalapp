import { Box, styled } from "@mui/material";
import {
  Dialog,
  DialogHeader,
  LoadingButton,
  TextField,
  Typography
} from "@vizexplorer/global-ui-v2";
import { gql } from "@apollo/client";
import { useAlert } from "view-v2/alert";
import { InputLabel } from "view-v2/input-label";
import { useNavigate } from "react-router-dom";
import { useImpersonateOrgV2Mutation } from "./__generated__/access-reason-dialog";
import CorporateFareRoundedIcon from "@mui/icons-material/CorporateFareRounded";
import { FormEvent, useState } from "react";

type Props = {
  orgId: string;
  orgName: string;
  onClose: VoidFunction;
};

const ContentContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  padding: theme.spacing(0, 2, 3, 2)
}));

const KeyValueContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "max-content auto",
  columnGap: theme.spacing(1),
  marginBottom: theme.spacing(1)
}));

const StyledForm = styled("form")({
  height: "100%"
});

export function AccessOrgDialog({ orgId, orgName, onClose }: Props) {
  const { addAlert } = useAlert();
  const navigate = useNavigate();
  const [reason, setReason] = useState<string>("");
  const isReasonValid = reason.length === 0 || reason.length >= 5;

  const [impersonateOrg, { loading: impersonatingOrg }] = useImpersonateOrgV2Mutation({
    onError: () => {
      addAlert({
        severity: "error",
        message: "An unexpected error occurred while saving. Please try again."
      });
    },
    onCompleted: () => {
      navigate(orgId, { replace: true });
      onClose();
    }
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!orgId || !reason) return;
    impersonateOrg({
      variables: { orgId, reason }
    });
  }

  return (
    <Dialog
      data-testid={"access-reason-dialog"}
      open
      disableRestoreFocus
      PaperProps={{
        sx: { width: "400px", height: "620px" }
      }}
    >
      <DialogHeader
        title={"Please provide the reason for accessing the Organization"}
        disableClose={impersonatingOrg}
        onClickClose={onClose}
      />
      <StyledForm data-testid={"access-reason-form"} noValidate onSubmit={handleSubmit}>
        <ContentContainer>
          <Box display={"grid"}>
            <Box display={"flex"} gap={1} mb={2}>
              <CorporateFareRoundedIcon />
              <Box>
                <KeyValueContainer>
                  <Typography fontWeight={600}>Organization:</Typography>
                  <Typography overflow={"hidden"} textOverflow={"ellipsis"}>
                    {orgName}
                  </Typography>
                </KeyValueContainer>
                <KeyValueContainer>
                  <Typography fontWeight={600}>Org ID:</Typography>
                  <Typography>{orgId}</Typography>
                </KeyValueContainer>
              </Box>
            </Box>

            <Box display="flex" flexDirection="column">
              <InputLabel>Access reason</InputLabel>

              <TextField
                autoFocus
                data-testid={"access-reason-input"}
                error={!isReasonValid}
                helperText={
                  !isReasonValid ? "Access has to be at least 5 characters" : ""
                }
                inputProps={{ maxLength: 255 }}
                placeholder={"Enter reason"}
                value={reason}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setReason(e.target.value)
                }
              />
            </Box>
          </Box>

          <LoadingButton
            loading={impersonatingOrg}
            disabled={!reason || !isReasonValid || impersonatingOrg}
            size={"large"}
            variant={"contained"}
            type="submit"
          >
            {!impersonatingOrg ? "Save and access" : "Accessing organization"}
          </LoadingButton>
        </ContentContainer>
      </StyledForm>
    </Dialog>
  );
}

const _IMPERSONATE_ORG_MUTATION = gql`
  mutation impersonateOrgV2($orgId: ID!, $reason: String!) {
    sudoImpersonateOrgV2(orgId: $orgId, reason: $reason)
  }
`;
