import React, { useEffect, useState } from "react";
import { Box, Paper, Tooltip, Typography, useTheme } from "@mui/material";
import { LoyaltyTierFragment } from "generated-graphql";
import { TIER_ITEM_TOP_Y } from "./utils";
import styled from "@emotion/styled";
import { useFnDebounce } from "../../../../view/utils";

const StyledColorPicker = styled.input({
  border: "none",
  padding: 0,
  width: "60px",
  ["::-webkit-color-swatch-wrapper"]: {
    padding: 0
  },
  ["::-webkit-color-swatch"]: {
    border: "none",
    borderRadius: "4px"
  }
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1),
  position: "absolute",
  transition: "transform .3s"
}));

const StyledHeader = styled.div(({ theme }) => ({
  display: "grid",
  gridTemplateRows: "30px",
  gridTemplateColumns: "240px 60px",
  padding: theme.spacing(1)
}));

type Props = {
  tiers: LoyaltyTierFragment[];
  tierOrder: string[];
  onColorChange: (idx: number, value: string) => void;
  disabled: boolean;
};

export function TierDetail({ tiers, tierOrder, onColorChange, disabled }: Props) {
  const theme = useTheme();

  return (
    <Box data-testid={"tier-detail"}>
      <StyledHeader>
        <Typography fontWeight={500} paddingLeft={theme.spacing(1)}>
          Tier Name
        </Typography>
        <Typography fontWeight={500} textAlign={"center"}>
          Color
        </Typography>
      </StyledHeader>
      <Box>
        <Box position={"relative"}>
          {tiers.map((tier, idx) => {
            const tierOrderIdx = tierOrder.findIndex((tierId) => tierId === tier.id);

            return (
              <TierDetailRowMemo
                key={tier.id}
                idx={idx}
                rank={tierOrderIdx}
                tier={tier}
                disabled={disabled}
                onColorChange={onColorChange}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

type TierDetailRowProps = {
  idx: number;
  tier: LoyaltyTierFragment;
  rank: number;
  onColorChange: any;
  disabled: boolean;
};

function TierDetailRowComponent({
  idx,
  tier,
  rank,
  onColorChange,
  disabled
}: TierDetailRowProps) {
  const theme = useTheme();

  return (
    <StyledPaper
      data-testid={"tier-detail-row"}
      elevation={1}
      sx={{
        transform: `translateY(${rank * TIER_ITEM_TOP_Y}px)`
      }}
    >
      <Box
        display={"grid"}
        gridTemplateColumns={"auto auto"}
        columnGap={theme.spacing(2)}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Tooltip title={tier.name} placement={"top-start"} enterDelay={500}>
          <Typography
            paddingLeft={theme.spacing(2)}
            overflow={"hidden"}
            whiteSpace={"nowrap"}
            textOverflow={"ellipsis"}
          >
            {tier.name}
          </Typography>
        </Tooltip>
        <ColorPicker
          color={tier.color}
          onChange={(value) => onColorChange(idx, value)}
          disabled={disabled}
        />
      </Box>
    </StyledPaper>
  );
}

const TierDetailRowMemo = React.memo(
  TierDetailRowComponent,
  (props: TierDetailRowProps, prevProps: TierDetailRowProps) => {
    return (
      props.tier.id === prevProps.tier.id &&
      props.rank === prevProps.rank &&
      props.disabled === prevProps.disabled
    );
  }
);

type ColorPickerProps = {
  color: string;
  onChange: (color: string) => void;
  disabled: boolean;
};

function ColorPicker({ color: providedColor, onChange, disabled }: ColorPickerProps) {
  const debounce = useFnDebounce();
  const [color, setColor] = useState(providedColor);

  useEffect(() => {
    // color picker can make many requests as the user drags their mouse around the input
    // which causes expensive repaints with the tierList changing
    debounce(() => {
      onChange(color);
    }, 50);
  }, [color]);

  return (
    <StyledColorPicker
      data-testid={"tier-color-input"}
      type={"color"}
      value={color}
      onChange={(e) => setColor(e.target.value)}
      disabled={disabled}
    />
  );
}
