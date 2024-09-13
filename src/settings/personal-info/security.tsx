import { useState } from "react";
import styled from "@emotion/styled";
import { Typography, Box, useTheme, Divider } from "@mui/material";
import { TextStyleButton } from "../common";
import { Card, Field, FieldTitle, PlainCardHeader } from "../../view/card";
import { Edit } from "@mui/icons-material";
import { PasswordResetDialog } from "./password-reset-dialog";
import { MultifactorToggle } from "./multifactor-toggle";
import { GaUserFragment } from "generated-graphql";

const StyledField = styled(Field)(({ theme }) => ({
  gridTemplateColumns: "180px auto",
  [`@media (max-width: ${theme.breakpoints.values.md - 1}px)`]: {
    gridTemplateColumns: "max-content auto",
    columnGap: theme.spacing(3)
  }
}));

type Props = {
  currentUser: GaUserFragment;
  mfa: boolean;
};

export function Security({ currentUser, mfa }: Props) {
  const theme = useTheme();
  const [resetPassword, setResetPassword] = useState<boolean>(false);

  return (
    <>
      {resetPassword && (
        <PasswordResetDialog user={currentUser} onClose={() => setResetPassword(false)} />
      )}
      <Card data-testid="security">
        <PlainCardHeader>
          <Typography variant={"h6"}>Security</Typography>
        </PlainCardHeader>
        <Box padding={theme.spacing(0, 4, 2, 4)}>
          <StyledField>
            <FieldTitle variant={"subtitle2"}>Password</FieldTitle>
            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
              <Typography>********</Typography>
              <TextStyleButton
                startIcon={<Edit />}
                color={"primary"}
                onClick={() => setResetPassword(true)}
                sx={{ marginLeft: theme.spacing(1) }}
              >
                Reset Password
              </TextStyleButton>
            </Box>
          </StyledField>
          <Divider />
          <MultifactorToggle currentUser={currentUser} enabled={mfa} />
        </Box>
      </Card>
    </>
  );
}
