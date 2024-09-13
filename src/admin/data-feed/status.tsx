import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import { useDataFeedStatusQuery } from "generated-graphql";
import { Card, PlainCardHeader } from "../../view/card";

export function FeedStatus() {
  const theme = useTheme();
  const { data, loading, error } = useDataFeedStatusQuery();

  if (error) throw error;

  return (
    <Card data-testid={"feed-status"}>
      <PlainCardHeader>
        <Typography variant={"h6"}>Status</Typography>
      </PlainCardHeader>
      <Box padding={theme.spacing(0, 4, 2, 4)}>
        {loading && <Skeleton />}
        {!loading && <DateStatus date={data?.dataFeedStatus?.maxDate} />}
      </Box>
    </Card>
  );
}

type DateStatusProps = {
  date?: any;
};

function DateStatus({ date }: DateStatusProps) {
  if (!date) {
    return (
      <Typography>
        There is no data found for this organization. Please verify data feed
        installation.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography>Most Recent Update: {date}</Typography>
    </Box>
  );
}
