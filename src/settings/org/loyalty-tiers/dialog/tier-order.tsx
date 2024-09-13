import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { TIER_ITEM_TOP_Y } from "./utils";

type Props = {
  numTiers: number;
};

function TierOrderComponent({ numTiers }: Props) {
  const theme = useTheme();

  return (
    <Box>
      <Box display={"grid"} padding={theme.spacing(1)} gridTemplateRows={"30px"}>
        <Typography fontWeight={500} textAlign={"center"}>
          Rank Order
        </Typography>
      </Box>
      <Box
        display={"grid"}
        gridTemplateRows={`repeat(${numTiers}, ${TIER_ITEM_TOP_Y}px)`}
      >
        {Array(numTiers)
          .fill(null)
          .map((_, idx) => (
            <Box
              key={`rank-${idx}`}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              height={"43px"}
            >
              <Typography fontWeight={500}>{idx + 1}</Typography>
            </Box>
          ))}
      </Box>
    </Box>
  );
}

export const TierOrder = React.memo(TierOrderComponent);
