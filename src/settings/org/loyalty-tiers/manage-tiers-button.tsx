import { GaUserFragment, LoyaltyTierFragment } from "generated-graphql";
import { disableManageTiersReasoning } from "./utils";
import { SettingAction } from "../../common";
import { Edit } from "@mui/icons-material";

type Props = {
  currentUser: GaUserFragment | null;
  tiers: LoyaltyTierFragment[];
  onClick: VoidFunction;
  loading: boolean;
};

export function ManageTiersButton({ currentUser, tiers, onClick, loading }: Props) {
  const disabledReasoning = disableManageTiersReasoning(currentUser, tiers, loading);

  return (
    <SettingAction
      tooltip={disabledReasoning}
      data-testid={"manage-tiers-btn"}
      startIcon={<Edit />}
      color={"primary"}
      onClick={onClick}
      disabled={!!disabledReasoning}
    >
      Manage Loyalty Tiers
    </SettingAction>
  );
}
