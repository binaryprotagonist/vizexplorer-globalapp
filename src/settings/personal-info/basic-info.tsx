import styled from "@emotion/styled";
import { Box, Typography, useTheme, Divider } from "@mui/material";
import { OverflowText, SettingAction } from "../common";
import { Card, Field, FieldTitle, PlainCardHeader } from "../../view/card";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { GaUserFragment } from "generated-graphql";

const StyledField = styled(Field)(({ theme }) => ({
  gridTemplateColumns: "180px auto",
  [`@media (max-width: ${theme.breakpoints.values.sm - 1}px)`]: {
    gridTemplateColumns: "90px auto",
    columnGap: theme.spacing(1)
  }
}));

type Props = {
  currentUser: GaUserFragment;
};

export function BasicInfo({ currentUser }: Props) {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <>
      <SettingAction
        startIcon={<Edit />}
        color={"primary"}
        onClick={() => {
          navigate("/settings/personal-info/basic-info/edit");
        }}
      >
        Manage Basic Info
      </SettingAction>
      <Card data-testid="basic-info">
        <PlainCardHeader>
          <Typography variant={"h6"}>Basic Info</Typography>
        </PlainCardHeader>
        <Box padding={theme.spacing(0, 4, 2, 4)}>
          <StyledField>
            <FieldTitle variant={"subtitle2"}>Name</FieldTitle>
            <OverflowText>
              {currentUser.firstName} {currentUser.lastName}
            </OverflowText>
          </StyledField>
          <Divider />
          <StyledField>
            <FieldTitle variant={"subtitle2"}>Email</FieldTitle>
            <OverflowText>{currentUser.email}</OverflowText>
          </StyledField>
          <Divider />
          <StyledField>
            <FieldTitle variant={"subtitle2"}>Phone</FieldTitle>
            <OverflowText>{currentUser.phone}</OverflowText>
          </StyledField>
        </Box>
      </Card>
    </>
  );
}
