import { Box, Button, Skeleton, Typography, useTheme } from "@mui/material";
import { useDataAdapterEnableMutation } from "generated-graphql";
import { Card, PlainCardHeader } from "../../view/card";

type Props = {
  disabled: boolean;
  loading: boolean;
  onEnable: VoidFunction;
};

export function Enable({ disabled, loading, onEnable }: Props) {
  const theme = useTheme();
  const [enableDataAdapter, { loading: enabling, error: enableErr }] =
    useDataAdapterEnableMutation();

  async function onEnableClick() {
    await enableDataAdapter();
    onEnable();
  }

  if (enableErr) throw enableErr;

  return (
    <Card data-testid={"feed-enable"}>
      <PlainCardHeader>
        <Typography variant={"h6"}>Data Feed Configuration</Typography>
      </PlainCardHeader>
      <Box padding={theme.spacing(0, 4, 2, 4)}>
        {loading && <Skeleton variant={"rectangular"} width={165} height={38} />}
        {!loading && (
          <Button
            data-testid={"data-feed-enable-btn"}
            variant={"contained"}
            color={"success"}
            onClick={onEnableClick}
            disabled={enabling || disabled}
          >
            Enable Data Feed
          </Button>
        )}
      </Box>
    </Card>
  );
}
