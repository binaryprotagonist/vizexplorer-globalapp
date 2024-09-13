import { Box, BoxProps } from "@mui/material";

type Props = {
  isMultiProperty: boolean;
} & BoxProps;

export function GridInputLayout({ isMultiProperty, ...boxProps }: Props) {
  return (
    <Box
      display={"grid"}
      gap={3}
      gridTemplateColumns={`repeat(3, minmax(0, 1fr)) ${isMultiProperty ? "80px" : ""}`}
      {...boxProps}
    />
  );
}
