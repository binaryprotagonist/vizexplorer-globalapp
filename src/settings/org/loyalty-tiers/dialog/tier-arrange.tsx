import React from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { TIER_ITEM_TOP_Y } from "./utils";

type Props = {
  numTiers: number;
  onClick: (index: number, direction: "up" | "down") => void;
  disabled: boolean;
};

function TierArrangeComponent({ numTiers, onClick, disabled }: Props) {
  const theme = useTheme();

  return (
    <Box>
      <Box display={"grid"} padding={theme.spacing(1)} gridTemplateRows={"30px"}>
        <Typography fontWeight={500} textAlign={"center"}>
          Arrange
        </Typography>
      </Box>
      <Box
        display={"grid"}
        gridTemplateRows={`repeat(${numTiers}, ${TIER_ITEM_TOP_Y}px)`}
      >
        {Array(numTiers)
          .fill(null)
          .map((_, idx) => {
            return (
              <Box
                key={`arrange-${idx}`}
                display={"grid"}
                gridTemplateRows={"auto auto"}
                height={"43px"}
              >
                <IconButton
                  data-testid={"tier-arrange-up"}
                  disableRipple
                  onClick={() => onClick(idx, "up")}
                  disabled={idx === 0 || disabled}
                  sx={{ height: "20px", padding: 0 }}
                >
                  <ArrowDropUp viewBox={"6, 3, 12, 12"} sx={{ fontSize: "20px" }} />
                </IconButton>
                <IconButton
                  data-testid={"tier-arrange-down"}
                  disableRipple
                  onClick={() => onClick(idx, "down")}
                  disabled={idx === numTiers - 1 || disabled}
                  sx={{ height: "20px", padding: 0 }}
                >
                  <ArrowDropDown viewBox={"6, 9, 12, 12"} sx={{ fontSize: "20px" }} />
                </IconButton>
              </Box>
            );
          })}
      </Box>
    </Box>
  );
}

export const TierArrange = React.memo(TierArrangeComponent);
