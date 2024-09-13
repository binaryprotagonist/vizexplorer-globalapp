import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/CheckRounded";

type Props = {
  onClose: VoidFunction;
};

export function AssociationSuccessDialog({ onClose }: Props) {
  const theme = useTheme();

  return (
    <Dialog open data-testid={"association-success-dialog"} onClose={onClose}>
      <DialogTitle>
        <IconButton
          data-testid={"close-button"}
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#1C1B1F"
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          m={theme.spacing(6, 2)}
        >
          <Box
            p={theme.spacing(2)}
            borderRadius={"50%"}
            border={"5px solid #008AED"}
            width={"max-content"}
            height={"max-content"}
          >
            <CheckIcon sx={{ width: "76px", height: "76px", color: "#008AED" }} />
          </Box>
          <Box
            display={"grid"}
            rowGap={theme.spacing(1)}
            mt={theme.spacing(4)}
            textAlign={"center"}
          >
            <Typography variant={"h5"}>{"The association was successful!"}</Typography>
            <Typography>{'You will now find it in the "Associated" tab'}</Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
