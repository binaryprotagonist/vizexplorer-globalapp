import { useState } from "react";
import { Box, Divider, IconButton, Skeleton, Typography, useTheme } from "@mui/material";
import styled from "@emotion/styled";
import FileCopy from "@mui/icons-material/FileCopy";
import { FeedCredentials } from "./types";

const StyledDivider = styled(Divider)(({ theme }) => ({
  gridColumn: "span 3",
  margin: theme.spacing(1, 0)
}));

const StyledSkeleton = styled(Skeleton)({
  height: 40,
  width: 540
});

type Props = {
  credentials: FeedCredentials | null;
  loading: boolean;
  onClickCopy: (value: string) => void;
};

export function DatabaseCredentials({ credentials, loading, onClickCopy }: Props) {
  const theme = useTheme();

  if (loading) return <LoadingSkeleton />;
  if (!credentials) {
    throw Error("Org does not have associated staging database");
  }

  return (
    <Box
      data-testid={"database-credentials"}
      display={"grid"}
      gridTemplateColumns={"max-content auto min-content"}
      columnGap={theme.spacing(4)}
      alignItems={"center"}
    >
      <Field label={"Host"} value={credentials.host} onClickCopy={onClickCopy} />
      <StyledDivider />

      <Field label={"Port"} value={`${credentials.port}`} onClickCopy={onClickCopy} />
      <StyledDivider />

      <Field
        label={"Database Name"}
        value={credentials.dbName}
        onClickCopy={onClickCopy}
      />
      <StyledDivider />

      <Field label={"Username"} value={credentials.username} onClickCopy={onClickCopy} />
      <StyledDivider />

      <Field label={"Password"} value={credentials.password} onClickCopy={onClickCopy} />
      <StyledDivider />

      <Field
        label={"Notify Data Loaded"}
        value={credentials.slotFeedEndpoint}
        onClickCopy={onClickCopy}
      />
    </Box>
  );
}

function LoadingSkeleton() {
  return (
    <>
      <StyledSkeleton data-testid={"stage-db-loading"} />
      <StyledDivider />
      <StyledSkeleton />
      <StyledDivider />
      <StyledSkeleton />
      <StyledDivider />
      <StyledSkeleton />
      <StyledDivider />
      <StyledSkeleton />
      <StyledDivider />
      <StyledSkeleton />
    </>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onClickCopy: (value: string) => void;
};

function Field({ label, value, onClickCopy }: FieldProps) {
  const [hovering, setHovering] = useState<boolean>(false);
  const normalizedLabel = label.replace(/ /g, "").toLowerCase();

  return (
    <>
      <Typography>{label}:</Typography>
      <Typography
        data-testid={`stage-db-${normalizedLabel}`}
        noWrap={!hovering}
        onMouseOver={() => setHovering(true)}
        onMouseOut={() => setHovering(false)}
        sx={{ wordBreak: "break-all" }}
      >
        {value}
      </Typography>
      <IconButton
        data-testid={`stage-db-${normalizedLabel}-copy`}
        onClick={() => onClickCopy(value)}
      >
        <FileCopy />
      </IconButton>
    </>
  );
}
