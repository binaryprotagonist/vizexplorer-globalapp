import { SVGProps } from "react";
import { useTheme } from "@mui/material";

type Props = {
  active: boolean;
} & SVGProps<SVGSVGElement>;

export function PropertiesIcon({ active, ...rest }: Props) {
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
      <path
        d="M11.3375 6.75C11.3375 6.00442 11.9419 5.4 12.6875 5.4H17C17.7456 5.4 18.35 6.00442 18.35 6.75V17C18.35 17.7456 17.7456 18.35 17 18.35H11.3375V6.75Z"
        strokeWidth="1.3"
      />
      <path
        d="M0.65 2C0.65 1.25442 1.25442 0.65 2 0.65H9.875C10.6206 0.65 11.225 1.25442 11.225 2V18.35H2C1.25442 18.35 0.65 17.7456 0.65 17V2Z"
        strokeWidth="1.3"
      />
    </svg>
  );
}
