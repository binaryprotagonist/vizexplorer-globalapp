import { Box, BoxProps, styled } from "@mui/material";
import { InputLabel, Typography, useGlobalTheme } from "@vizexplorer/global-ui-v2";

const CountContainer = styled(Box)({
  display: "flex",
  borderRadius: "50%",
  width: "max-content",
  height: "max-content",
  minWidth: "24px",
  padding: "2px 4px",
  justifyContent: "center",
  marginLeft: "2px",
  marginTop: "-4px"
});

type Props = {
  label: string;
  count: number;
} & BoxProps;

export function CountInputLabel({ count, label, ...rest }: Props) {
  const theme = useGlobalTheme();

  return (
    <Box display={"flex"} {...rest}>
      <InputLabel>{label}</InputLabel>
      {count > 0 && (
        <CountContainer bgcolor={theme.colors.primary[50]}>
          <Typography
            data-testid={"count"}
            variant={"bodySmall"}
            fontWeight={600}
            sx={{ color: theme.colors.primary[700] }}
          >
            {count}
          </Typography>
        </CountContainer>
      )}
    </Box>
  );
}
