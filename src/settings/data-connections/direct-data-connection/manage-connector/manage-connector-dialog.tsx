import { css, Theme } from "@emotion/react";
import { Box, Button, Dialog, DialogTitle, Typography, useTheme } from "@mui/material";
import { ConnectorForm } from "./connector-form";
import {
  DataConnectorFieldsFragment,
  DataConnectorFieldsFragmentDoc,
  OdrDataConnectorCreateMutation,
  useOdrDataConnectorCreateMutation,
  useOdrDataConnectorUpdateMutation
} from "generated-graphql";
import { useEffect, useState } from "react";
import { FormInput } from "./types";
import { FormError } from "../../../../view/form";
import { ApolloCache, FetchResult } from "@apollo/client";
import { formInputAsCreateInput, formInputAsUpdateInput, validateForm } from "./utils";
import { NotNullObj } from "../../../../view/utils";

const headerStyle = (theme: Theme) =>
  css({
    padding: theme.spacing(2),
    background: "rgba(0, 138, 237, 0.08)",
    fontSize: theme.typography.h4.fontSize,
    textAlign: "center"
  });

type Props = {
  connector: DataConnectorFieldsFragment | null;
  onClose: (newConnector?: DataConnectorFieldsFragment) => void;
};

export function ManageConnectorDialog({ connector, onClose }: Props) {
  const theme = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [createConnector, { loading: creatingConnector }] =
    useOdrDataConnectorCreateMutation({
      update: addConnectorToCache,
      onCompleted: (data) => onClose(data.odrDataConnectorCreate!),
      onError: (e) => setError(e.message)
    });
  const [updateConnector, { loading: updatingConnector }] =
    useOdrDataConnectorUpdateMutation({
      onCompleted: (data) => onClose(data.odrDataConnectorUpdate!),
      onError: (e) => setError(e.message)
    });

  useEffect(() => {
    if (!error) return;
    const overflowContainer = document.getElementById("overflow-container");
    overflowContainer
      ? overflowContainer.scrollTo({ top: 0, behavior: "smooth" })
      : console.warn("couldn't locate overflow container");
  }, [error]);

  function addConnectorToCache(
    cache: ApolloCache<OdrDataConnectorCreateMutation>,
    { data }: FetchResult<OdrDataConnectorCreateMutation>
  ) {
    if (!data?.odrDataConnectorCreate) return;

    cache.modify({
      fields: {
        odrDataConnectors(existing = []) {
          const newConnector = cache.writeFragment({
            data: data.odrDataConnectorCreate,
            fragment: DataConnectorFieldsFragmentDoc,
            fragmentName: "DataConnectorFields"
          });
          return [...existing, newConnector];
        }
      }
    });
  }

  function onSubmit(form: FormInput) {
    setError(null);

    validateForm(form, {
      onSuccess: (validatedForm: NotNullObj<FormInput>) => {
        // update
        if (connector) {
          const input = formInputAsUpdateInput(validatedForm, connector);
          updateConnector({
            variables: { input }
          });
          return;
        }

        // create
        const input = formInputAsCreateInput(validatedForm);
        createConnector({ variables: { input } });
      },
      onError: (err) => setError(err)
    });
  }

  const loading = creatingConnector || updatingConnector;

  return (
    <Dialog
      data-testid={"manage-connector-dialog"}
      open={true}
      sx={{ overflow: "hidden" }}
      onClose={!loading ? () => onClose() : undefined}
    >
      <DialogTitle css={headerStyle}>
        {!connector ? "Add" : "Edit"} Source Connection
      </DialogTitle>
      <Box display={"grid"} overflow={"hidden"}>
        <Box id={"overflow-container"} overflow={"auto"}>
          <Box margin={theme.spacing(3, 0)}>
            <Typography variant={"h6"} align={"center"} color={"hsla(222, 8%, 30%, 0.7)"}>
              Please Provide Connection Details
            </Typography>
          </Box>
          <FormError
            in={!!error}
            sx={{
              padding: theme.spacing(0, 4),
              marginBottom: theme.spacing(2)
            }}
          >
            {error}
          </FormError>
          <ConnectorForm connector={connector} onSubmit={onSubmit} disabled={loading} />
        </Box>

        <Box textAlign={"end"} margin={theme.spacing(3)}>
          <Button
            size={"large"}
            color={"secondary"}
            sx={{ marginRight: theme.spacing(2) }}
            onClick={() => onClose()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            form={"connector-form"}
            size={"large"}
            type={"submit"}
            variant={"contained"}
            color={"primary"}
            disabled={loading}
          >
            Continue
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
