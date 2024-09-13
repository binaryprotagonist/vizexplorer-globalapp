import { Box, DialogContentText } from "@mui/material";
import { GeneralDialog } from "../../../view/dialog";
import { SiteFragment, useDeleteSiteMutation } from "generated-graphql";

type Props = {
  site: SiteFragment;
  onClose: () => void;
};

export function DeleteSiteDialog({ site, onClose }: Props) {
  const [deleteSite, { loading, error }] = useDeleteSiteMutation({
    update(cache, { data }) {
      if (data?.siteDelete) {
        cache.evict({ id: cache.identify(site) });
        cache.gc();
      }
    },
    onCompleted: onClose
  });

  function onClickDelete() {
    if (loading) return;
    const { id } = site;
    deleteSite({ variables: { id } });
  }

  function handleClose() {
    if (loading) return;
    onClose();
  }

  if (error) throw error;

  return (
    <GeneralDialog
      data-testid={"delete-site-dialog"}
      open={true}
      onClose={handleClose}
      title={"Delete Property"}
      actions={[
        {
          content: "Cancel",
          disabled: loading,
          color: "secondary",
          onClick: handleClose
        },
        {
          content: "Delete",
          disabled: loading,
          variant: "contained",
          color: "error",
          onClick: onClickDelete
        }
      ]}
    >
      <Box data-testid={"delete-site-message"} display={"grid"} rowGap={"8px"}>
        <DialogContentText>
          Delete Property <strong>{site.name}</strong>?
        </DialogContentText>
        <DialogContentText>
          This will permanently delete users&apos; access and settings for the property.
        </DialogContentText>
      </Box>
    </GeneralDialog>
  );
}
