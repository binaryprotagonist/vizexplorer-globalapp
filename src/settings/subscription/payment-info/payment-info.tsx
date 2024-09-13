import { Box, Divider, styled, Typography, useTheme } from "@mui/material";
import { OverflowText, SettingAction } from "../../common";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { canUser } from "../../../view/user/utils";
import { UserActionType } from "../../../view/user/types";
import { Card, Field, FieldTitle, PlainCardHeader } from "../../../view/card";
import { GaCompanyFragment, GaUserFragment } from "generated-graphql";

const StyledField = styled(Field)`
  grid-template-columns: 180px auto;
`;

type Props = {
  company: GaCompanyFragment;
  currentUser: GaUserFragment;
};

export function PaymentInfo({ company, currentUser }: Props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { address } = company;
  const fullAddress = [
    address.street1,
    address.city,
    address.region,
    address.country,
    address.postalCode
  ]
    .filter(Boolean)
    .join(", ");

  const canEditPayment = canUser(currentUser, {
    type: UserActionType.MANAGE_PAYMENT
  });
  return (
    <>
      <SettingAction
        data-testid={"manage-payment-info"}
        startIcon={<Edit />}
        color={"primary"}
        onClick={() => {
          navigate("payment/edit");
        }}
        disabled={!canEditPayment}
        tooltip={
          !canEditPayment
            ? "You don't have permission to edit Payment Information. Please contact an Org Admin."
            : ""
        }
      >
        Manage Payment Info
      </SettingAction>
      <Card data-testid="payment-info">
        <PlainCardHeader>
          <Typography variant={"h6"}>Payment Information</Typography>
        </PlainCardHeader>
        <Box padding={theme.spacing(0, 4, 2, 4)}>
          <StyledField>
            <FieldTitle variant={"subtitle2"}>Acct. Payable Email</FieldTitle>
            <OverflowText>{company.email}</OverflowText>
          </StyledField>

          <Divider />

          <StyledField>
            <FieldTitle variant={"subtitle2"}>Acct. Payable Phone</FieldTitle>
            <OverflowText>{address.phone}</OverflowText>
          </StyledField>

          <Divider />

          <StyledField>
            <FieldTitle variant={"subtitle2"}>Company Name</FieldTitle>
            <OverflowText>{company.name}</OverflowText>
          </StyledField>

          <Divider />

          <StyledField>
            <FieldTitle variant={"subtitle2"}>Address</FieldTitle>
            <OverflowText>{fullAddress}</OverflowText>
          </StyledField>
        </Box>
      </Card>
    </>
  );
}
