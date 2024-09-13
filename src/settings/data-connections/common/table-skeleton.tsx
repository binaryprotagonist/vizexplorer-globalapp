import { Box, BoxProps, Skeleton } from "@mui/material";

export function DataConnectionTableSkeleton(props: BoxProps) {
  return (
    <Box p={"0 18px 18px 18px"} {...props}>
      <Skeleton
        variant={"rectangular"}
        width={220}
        height={35}
        sx={{ margin: "0 18px 8px auto" }}
      />
      <Skeleton variant={"rectangular"} width={"100%"} height={200} />
    </Box>
  );
}
