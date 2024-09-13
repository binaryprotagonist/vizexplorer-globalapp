import { Box } from "@mui/material";
import { ReactNode } from "react";
import { ColorPartial, useGlobalTheme } from "@vizexplorer/global-ui-v2";

type Props = {
  icon: ReactNode;
  color: "primary" | "warning";
};

export function TwoToneCircleIcon({ icon, color }: Props) {
  const theme = useGlobalTheme();
  const { innerShade, outerShade, iconShade } = colorShades(color);
  const innerColor = theme.colors[color][innerShade];
  const outerColor = theme.colors[color][outerShade];
  const iconColor = theme.colors[color][iconShade];

  return (
    <Box
      data-testid={"two-tone-circle"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      minWidth={"54px"}
      minHeight={"54px"}
      borderRadius={"50%"}
      sx={{
        background: `radial-gradient(circle, ${innerColor} 45%, ${outerColor} 45%)`,
        ["& svg"]: {
          color: iconColor
        }
      }}
    >
      {icon}
    </Box>
  );
}

type ColorShades = {
  innerShade: keyof ColorPartial;
  outerShade: keyof ColorPartial;
  iconShade: keyof ColorPartial;
};

function colorShades(color: "primary" | "warning"): ColorShades {
  switch (color) {
    case "primary":
      return {
        innerShade: 100,
        outerShade: 50,
        iconShade: 600
      };
    case "warning":
      return {
        innerShade: 100,
        outerShade: 50,
        iconShade: 600
      };
  }
}
