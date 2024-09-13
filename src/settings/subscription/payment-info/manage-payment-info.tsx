import { Box, Typography, useTheme } from "@mui/material";
import { ManagePaymentInfoForm } from "./manage-payment-info-form";
import { Navigate } from "react-router-dom";
import { canUser } from "../../../view/user/utils";
import { UserActionType } from "../../../view/user/types";
import { BlueCardHeader, Card } from "../../../view/card";
import { useCompanyQuery, useCurrentUserQuery } from "generated-graphql";

export function ManagePaymentInfo() {
  const theme = useTheme();
  const { data: curUserData, error: curUserErr } = useCurrentUserQuery();
  const { data: companyData, error: companyErr } = useCompanyQuery();

  if (companyErr) throw companyErr;
  if (curUserErr) throw curUserErr;

  const company = companyData?.currentOrg?.company;
  const currentUser = curUserData?.currentUser;
  if (currentUser && !canUser(currentUser, { type: UserActionType.MANAGE_PAYMENT })) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <span data-testid={"manage-payment-info"} />
      <Box display={"flex"} flex={1} overflow={"hidden"}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          padding={theme.spacing(6, 3)}
          flex={1}
          minWidth={360}
        >
          {company && currentUser && (
            <Card
              sx={{
                display: "grid",
                maxWidth: "500px",
                margin: "0 auto",
                width: "100%",
                overflow: "hidden"
              }}
            >
              <BlueCardHeader>
                <Typography variant={"h4"} align={"center"}>
                  Update Payment Info
                </Typography>
              </BlueCardHeader>
              <ManagePaymentInfoForm company={company} />
            </Card>
          )}
        </Box>
      </Box>
    </>
  );
}
