import { useState } from "react";
import { LoyaltyTiersDialog } from "./dialog";
import { LoyaltyTiersTable } from "./loyalty-tiers-table";
import {
  PdTierInput,
  LoyaltyTierFragment,
  useCurrentUserQuery,
  useOrgLoyaltyTiersQuery,
  useOrgLoyaltyTiersUpdateMutation
} from "generated-graphql";
import { ManageTiersButton } from "./manage-tiers-button";

export function LoyaltyTiers() {
  const [manageTiers, setManageTiers] = useState<boolean>(false);
  const {
    data: curUserData,
    loading: curUserLoading,
    error: curUserErr
  } = useCurrentUserQuery();
  const {
    data: tiersData,
    loading: tiersLoading,
    error: tiersErr
  } = useOrgLoyaltyTiersQuery();
  const [updateTiers, { loading: tiersUpdating, error: tiersUpdateErr }] =
    useOrgLoyaltyTiersUpdateMutation();

  async function onTierRankingSave(tiers: LoyaltyTierFragment[]) {
    const input = tiers.map<PdTierInput>((t) => ({
      name: t.name,
      order: t.order,
      cssColor: t.color
    }));
    await updateTiers({ variables: { input } });
    setManageTiers(false);
  }

  if (tiersErr) throw tiersErr;
  if (tiersUpdateErr) throw tiersUpdateErr;
  if (curUserErr) throw curUserErr;

  const currentUser = curUserData?.currentUser;
  const tiers = tiersData?.pdOrgSettings?.tiers;

  return (
    <>
      {manageTiers && (
        <LoyaltyTiersDialog
          tiers={tiers || []}
          onClose={() => setManageTiers(false)}
          onSave={onTierRankingSave}
          loading={tiersUpdating}
        />
      )}
      <ManageTiersButton
        currentUser={currentUser || null}
        tiers={tiers || []}
        loading={tiersLoading || curUserLoading}
        onClick={() => setManageTiers(true)}
      />
      <LoyaltyTiersTable tiers={tiers || []} loading={tiersLoading || curUserLoading} />
    </>
  );
}
