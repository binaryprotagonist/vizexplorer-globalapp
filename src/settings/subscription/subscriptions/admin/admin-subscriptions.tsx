import { SubscriptionTable } from "../shared";
import { SubscriptionsProps } from "../types";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { SettingAction } from "../../../common";

export function AdminSubscriptions({
  currentUser,
  appSubscriptions,
  companyName
}: SubscriptionsProps) {
  const navigate = useNavigate();

  return (
    <>
      <SettingAction
        data-testid={"add-subscription-btn"}
        startIcon={<Add />}
        color={"primary"}
        onClick={() => navigate("new")}
      >
        Add Subscription
      </SettingAction>
      <SubscriptionTable
        currentUser={currentUser}
        appSubscriptions={appSubscriptions}
        companyName={companyName}
      />
    </>
  );
}
