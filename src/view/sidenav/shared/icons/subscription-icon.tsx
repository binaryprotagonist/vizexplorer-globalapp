import { useTheme } from "@mui/material";
import { SVGProps } from "react";

type Props = {
  active: boolean;
} & SVGProps<SVGSVGElement>;

export function SubscriptionIcon({ active, ...rest }: Props) {
  const theme = useTheme();

  return (
    <svg
      style={{
        fill: "none",
        stroke: active ? theme.palette.primary.main : theme.palette.text.primary
      }}
      width="19"
      height="19"
      viewBox="0 0 19 19"
      {...rest}
    >
      <rect x="0.65" y="0.65" width="13.7" height="14.7" rx="1.85" strokeWidth="1.3" />
      <rect
        x="4.65"
        y="3.65"
        width="13.7"
        height="14.7"
        rx="1.85"
        fill="white"
        strokeWidth="1.3"
      />
    </svg>
  );
}
