import { Box } from "@mui/material";
import {
  TypographyProps,
  TooltipProps,
  InputLabel as LibInputLabel
} from "@vizexplorer/global-ui-v2";
import { HelpTip } from "../help-tip";
import { CountInputLabel } from "./count-input-label";
import { ReactNode } from "react";

type DefaultLabelProps = {
  type?: "default";
  help?: ReactNode;
  helpProps?: TooltipProps;
} & TypographyProps<"label">;

type CountLabelProps = {
  type: "count";
  label: string;
  count: number;
};

type Props = DefaultLabelProps | CountLabelProps;

export function InputLabel(props: Props) {
  if (props.type === "count") {
    const { type: _type, ...rest } = props;
    return <CountInputLabel {...rest} />;
  }

  const { help, helpProps, gutterBottom = true, type: _type, ...rest } = props;

  if (help) {
    return (
      <Box display={"flex"} alignItems={"center"} mb={gutterBottom ? "0.35em" : 0}>
        <LibInputLabel gutterBottom={false} {...rest} />
        <HelpTip placement={"right-start"} title={help} {...helpProps} />
      </Box>
    );
  }

  return <LibInputLabel {...rest} />;
}
