import { useState } from "react";
import { Autocomplete, Box, TextField, Typography, useTheme } from "@mui/material";
import {
  OrgSitesMappingDocument,
  SiteMappingFragment,
  useSiteMappingUpdateMutation
} from "generated-graphql";
import { GeneralDialog } from "../../../view/dialog";

function sortOptions(a: string, b: string) {
  return a.localeCompare(b, "en", { numeric: true });
}

type Props = {
  siteMapping: SiteMappingFragment;
  sourceSiteIds: string[];
  onClose: VoidFunction;
};

export function SiteMappingDialog({ siteMapping, sourceSiteIds, onClose }: Props) {
  const theme = useTheme();
  const [sourceSite, setSourceSite] = useState<string | null>(
    siteMapping.dataFeedMapping?.sourceSiteId || null
  );
  const [updateMapping, { error: updateErr, loading: updating }] =
    useSiteMappingUpdateMutation({
      onCompleted: onClose,
      refetchQueries: [OrgSitesMappingDocument],
      awaitRefetchQueries: true
    });

  function onClickSave() {
    updateMapping({
      variables: {
        input: {
          siteId: `${siteMapping.id}`,
          sourceSiteId: sourceSite ? `${sourceSite}` : sourceSite
        }
      }
    });
  }

  if (updateErr) throw updateErr;

  return (
    <GeneralDialog
      data-testid={"site-mapping-dialog"}
      open={true}
      title={"Property Mapping"}
      actions={[
        {
          content: "Cancel",
          onClick: onClose,
          size: "large",
          color: "secondary",
          disabled: updating
        },
        {
          variant: "contained",
          content: "Save",
          onClick: onClickSave,
          size: "large",
          disabled: updating
        }
      ]}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        minWidth={350}
        minHeight={200}
        padding={theme.spacing(0, 2)}
      >
        <Typography
          gutterBottom
          variant={"h6"}
          align={"center"}
          color={"hsla(222, 8%, 30%, 0.7)"}
        >
          Please Provide Source Property ID
        </Typography>
        <Typography variant={"h5"} align={"center"} mb={theme.spacing(3)}>
          {siteMapping.name}
        </Typography>
        <Box padding={theme.spacing(2, 0)} mt={theme.spacing(2)}>
          <Autocomplete
            data-testid={"source-site-id"}
            disabled={updating}
            value={sourceSite}
            options={sourceSiteIds.sort(sortOptions)}
            onChange={(_, value) => setSourceSite(value)}
            renderInput={(props) => <TextField {...props} label={"Source Property ID"} />}
            renderOption={(props, option) => (
              <li {...props} data-testid={"source-site-id-option"}>
                {option}
              </li>
            )}
          />
        </Box>
      </Box>
    </GeneralDialog>
  );
}
