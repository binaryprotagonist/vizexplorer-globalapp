import { useTheme } from "@emotion/react";
import { Box, BoxProps, styled } from "@mui/material";
import { TextButtonProps, TextStyleButton } from "../button";

export const SettingsRoot = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: "auto",
  minWidth: 360,
  padding: theme.spacing(3)
}));

export const SettingsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  rowGap: theme.spacing(3),
  width: "100%"
}));

const SettingsContainerRoot = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  minWidth: 0,
  maxWidth: 1200,
  margin: "0 auto"
});

type ContentContainerProps = {
  reserveActionSpace?: boolean;
  reserveActionSpaceProps?: BoxProps;
} & BoxProps;

export function SettingContainer({
  reserveActionSpace = false,
  reserveActionSpaceProps,
  children,
  ...rest
}: ContentContainerProps) {
  const theme = useTheme();

  return (
    <SettingsContainerRoot {...rest}>
      {reserveActionSpace && (
        <Box height={"32px"} mb={theme.spacing(1)} {...reserveActionSpaceProps} />
      )}
      {children}
    </SettingsContainerRoot>
  );
}

const StyledActionContainer = styled(Box)(({ theme }) => ({
  textAlign: "end",
  margin: theme.spacing(0, 2, 1, 0)
}));

export function SettingAction(actionProps: TextButtonProps) {
  return (
    <StyledActionContainer>
      <TextStyleButton {...actionProps} />
    </StyledActionContainer>
  );
}
