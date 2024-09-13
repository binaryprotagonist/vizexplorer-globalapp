import { css, Theme } from "@emotion/react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Typography,
  useTheme,
  Autocomplete as MuiAutocomplete,
  TextField,
  FormHelperText
} from "@mui/material";
import {
  DataConnectorFieldsFragment,
  DataSourceFieldsFragment,
  OdrDataSourceKind,
  useOdrDataConnectorHostSitesLazyQuery,
  useOdrDataSourceUpdateMutation
} from "generated-graphql";
import { useEffect, useState } from "react";
import { Autocomplete, OptionChangeType } from "../../../../view/autocomplete";
import { sortArray } from "../../../../view/utils";
import { availableHostSites } from "./utils";

const headerStyle = (theme: Theme) =>
  css({
    padding: theme.spacing(2),
    background: "rgba(0, 138, 237, 0.08)",
    fontSize: theme.typography.h4.fontSize,
    textAlign: "center"
  });

type Props = {
  open: boolean;
  selectedSource: DataSourceFieldsFragment;
  sources: DataSourceFieldsFragment[];
  selectedConnector: DataConnectorFieldsFragment | null;
  connectors: DataConnectorFieldsFragment[];
  onConnectorChange: (change: OptionChangeType<DataConnectorFieldsFragment>) => void;
  onClose: VoidFunction;
};

export function SourceMappingDialog({
  open,
  selectedSource,
  sources,
  selectedConnector,
  connectors,
  onConnectorChange,
  onClose
}: Props) {
  const theme = useTheme();
  const [selectedHostId, setSelectedHostId] = useState<string | null>();
  const [updateSource, { loading: updatingSource }] = useOdrDataSourceUpdateMutation({
    onCompleted: onClose
  });
  const [loadHostSiteIds, { data: connectorSites, loading, error: connSiteErr }] =
    useOdrDataConnectorHostSitesLazyQuery();

  useEffect(() => {
    const hostId = connectorSites?.connector?.hostVizSiteIds?.find(
      (id) => id === selectedSource.connectorParams?.siteId
    );
    setSelectedHostId(hostId || null);
  }, [selectedSource, connectorSites]);

  useEffect(() => {
    if (!selectedConnector || selectedConnector.id == connectorSites?.connector?.id) {
      return;
    }
    loadHostSiteIds({ variables: { id: selectedConnector.id } });
    setSelectedHostId(null);
  }, [selectedConnector]);

  function handleSubmit() {
    if (!selectedHostId || !selectedConnector) return;

    updateSource({
      variables: {
        input: {
          kind: OdrDataSourceKind.HostViz,
          connectorId: selectedConnector.id,
          appId: selectedSource.app!.id,
          siteId: selectedSource.site!.id.toString(),
          hostVizSiteId: selectedHostId
        }
      }
    });
  }

  return (
    <Dialog
      data-testid={"source-mapping-dialog"}
      open={open}
      sx={{ overflow: "hidden" }}
      onClose={!updatingSource ? onClose : undefined}
      PaperProps={{
        sx: {
          minWidth: "340px",
          width: "500px"
        }
      }}
    >
      <DialogTitle css={headerStyle}>Edit Source Connection</DialogTitle>
      <Box display={"grid"} sx={{ overflowY: "auto", overflowX: "hidden" }}>
        <Box id={"overflow-container"} overflow={"auto"}>
          <Box margin={theme.spacing(3, 0)}>
            <Typography
              component={"h5"}
              variant={"h6"}
              align={"center"}
              color={"hsla(222, 8%, 30%, 0.7)"}
              gutterBottom
            >
              Please Provide Connection Details
            </Typography>
            <Typography component={"h6"} variant={"h5"} align={"center"}>
              {selectedSource.site!.name}
            </Typography>
          </Box>

          <Box display={"grid"} padding={theme.spacing(2, 4)} rowGap={theme.spacing(6)}>
            <Autocomplete
              data-testid={"connector-selector"}
              disableClearable
              type={"managed-options"}
              label={"Connection Name"}
              // @ts-ignore allow null values
              value={selectedConnector || null}
              newOptionLabel={"Add New Connection..."}
              onChange={onConnectorChange}
              options={sortArray(connectors, true, (connector) => connector.name)}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
            <Box>
              <MuiAutocomplete
                data-testid={"hostvizsite-selector"}
                disableClearable
                // @ts-ignore allow null values
                value={
                  connectorSites?.connector?.hostVizSiteIds?.find(
                    (id) => id === selectedHostId
                  ) || null
                }
                loading={loading}
                options={
                  !loading && connectorSites?.connector
                    ? sortArray(
                        availableHostSites(
                          connectorSites.connector,
                          selectedSource.id!,
                          sources
                        )
                      )
                    : []
                }
                onChange={(_, newValue) => setSelectedHostId(newValue)}
                renderInput={(props) => (
                  <TextField
                    {...props}
                    label={loading ? "Loading..." : "Source Property"}
                  />
                )}
              />
              {!!connSiteErr && (
                <FormHelperText error sx={{ marginLeft: "4px" }}>
                  Failed to retrieve source properties
                </FormHelperText>
              )}
            </Box>
          </Box>
        </Box>

        <Box textAlign={"end"} margin={theme.spacing(3)}>
          <Button
            size={"large"}
            color={"secondary"}
            sx={{ marginRight: theme.spacing(2) }}
            onClick={onClose}
            disabled={updatingSource}
          >
            Cancel
          </Button>
          <Button
            variant={"contained"}
            size={"large"}
            color={"primary"}
            disabled={!selectedHostId || updatingSource}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
