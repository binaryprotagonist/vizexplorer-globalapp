import { Box, styled, useTheme } from "@mui/material";
import { TwoToneCircleIcon } from "view-v2/two-tone-circle-icon";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import {
  Button,
  Dialog,
  DialogHeader,
  Typography,
  useGlobalTheme
} from "@vizexplorer/global-ui-v2";

const DialogContent = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "460px",
  padding: theme.spacing(4)
}));

const ContentContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minWidth: "380px"
});

const OrgDetailContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(1),
  margin: theme.spacing(3, 0, 5, 0),
  textAlign: "center"
}));

type Props = {
  id: string;
  name: string;
  onClickAccess?: (orgId: string, orgName: string) => void;
  onClose?: VoidFunction;
};

export function OrgCreateSuccessDialog({ id, name, onClickAccess, onClose }: Props) {
  const theme = useTheme();
  const globalTheme = useGlobalTheme();

  return (
    <Dialog
      data-testid={"org-create-success-dialog"}
      open
      PaperProps={{ sx: { width: "100%", maxWidth: "820px" } }}
    >
      <DialogHeader inlineTitle title={""} pb={theme.spacing(0)} onClickClose={onClose} />

      <DialogContent>
        <ContentContainer>
          <TwoToneCircleIcon icon={<CelebrationRoundedIcon />} color={"primary"} />

          <OrgDetailContainer>
            <Typography variant={"h3"} fontWeight={700}>
              {name} has been created!
            </Typography>

            <Typography display={"inline"} variant={"bodySmall"} fontWeight={600}>
              Org ID: <span style={{ fontWeight: 400 }}>{id}</span>
            </Typography>

            <Typography variant={"bodySmall"} color={globalTheme.colors.grey[700]}>
              Access the organization to continue customizing it
            </Typography>
          </OrgDetailContainer>

          <Button
            variant={"contained"}
            size={"small"}
            onClick={() => onClickAccess?.(id, name)}
          >
            Access organization
          </Button>
        </ContentContainer>
      </DialogContent>
    </Dialog>
  );
}
