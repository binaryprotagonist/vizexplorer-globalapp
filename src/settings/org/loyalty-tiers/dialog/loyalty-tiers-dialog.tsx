import { useCallback, useMemo, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { sortArray } from "../../../../view/utils";
import { produce } from "immer";
import { GeneralDialog } from "../../../../view/dialog";
import { LoyaltyTierFragment } from "generated-graphql";
import { TierArrange } from "./tier-arrange";
import { TierOrder } from "./tier-order";
import { TierDetail } from "./tier-detail";

type Props = {
  tiers: LoyaltyTierFragment[];
  loading: boolean;
  onSave: (tiers: LoyaltyTierFragment[]) => void;
  onClose: VoidFunction;
};

export function LoyaltyTiersDialog({
  tiers: providedTiers,
  loading,
  onSave,
  onClose
}: Props) {
  const theme = useTheme();
  const sortedTiers = useMemo(
    () => sortArray(providedTiers, true, (tier) => tier.order),
    [providedTiers]
  );
  const [tiers, setTiers] = useState<LoyaltyTierFragment[]>(sortedTiers);
  // for animation purposes, we need to track the ordering changes seperately (transition effects + state update simultaneously creates undesired results)
  // ranking is index based. index 0 = rank order 1
  const [tierOrder, setTierOrder] = useState<string[]>(sortedTiers.map((t) => t.id));

  const onArrangeClick = useCallback(
    (idx: number, direction: "up" | "down") => {
      const newOrder = produce(tierOrder, (draft) => {
        const nextIdx = direction === "up" ? idx - 1 : idx + 1;
        [draft[idx], draft[nextIdx]] = [draft[nextIdx], draft[idx]];
      });
      setTierOrder(newOrder);
    },
    [tierOrder]
  );

  function onClickSave() {
    // assign tiers to the respective order based on `tierOrder`
    const newTierRankings = produce(tiers, (draft) => {
      draft.forEach((tier) => {
        const rankedIdx = tierOrder.findIndex((tierId) => tierId === tier.id);
        tier.order = rankedIdx + 1;
      });
    });

    onSave(newTierRankings);
  }

  function onColorChange(idx: number, value: string) {
    setTiers((curTiers) => {
      return produce(curTiers, (draft) => {
        draft[idx].color = value;
      });
    });
  }

  return (
    <GeneralDialog
      data-testid={"loyalty-tiers-dialog"}
      open={true}
      title={"Manage Tier Rankings"}
      PaperProps={{ sx: { maxWidth: "900px" } }}
      actions={[
        {
          content: "Cancel",
          disabled: loading,
          color: "secondary",
          onClick: onClose
        },
        {
          content: "Save",
          disabled: loading,
          variant: "contained",
          color: "primary",
          onClick: onClickSave
        }
      ]}
    >
      <Box
        display={"grid"}
        gridTemplateColumns={"max-content auto auto"}
        columnGap={theme.spacing(4)}
        padding={theme.spacing(0, 2)}
        maxHeight={"600px"}
      >
        <TierOrder numTiers={tiers.length} />
        <TierDetail
          tiers={tiers}
          tierOrder={tierOrder}
          onColorChange={onColorChange}
          disabled={loading}
        />
        <TierArrange
          numTiers={tiers.length}
          onClick={onArrangeClick}
          disabled={loading}
        />
      </Box>
    </GeneralDialog>
  );
}
