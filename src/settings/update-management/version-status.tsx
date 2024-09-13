import styled from "@emotion/styled";
import { Box, Link, Typography, useTheme } from "@mui/material";
import { Card, Field, FieldTitle, PlainCardHeader } from "../../view/card";
import { LatestVersion } from "@vizexplorer/global-ui-core";

const StyledField = styled(Field)`
  grid-template-columns: 180px auto;
  min-height: 40px;
`;

type Props = {
  currentVersion: string;
  latestVersion?: LatestVersion | null;
  remainingDays?: number | null;
};

export function VersionStatus({ currentVersion, latestVersion, remainingDays }: Props) {
  const theme = useTheme();

  return (
    <Card data-testid="version-status">
      <PlainCardHeader>
        <Typography variant={"h6"}>
          {latestVersion ? "Update Available" : "Applications Up To Date"}
        </Typography>
      </PlainCardHeader>
      <Box padding={theme.spacing(0, 4, 2, 4)}>
        <RemainingDaysToUpdate remainingDays={remainingDays} />
        <StyledField>
          <FieldTitle variant={"subtitle2"}>Current Version</FieldTitle>
          <Typography data-testid={"current-version"}>{currentVersion}</Typography>
        </StyledField>
        {!!latestVersion && (
          <>
            <StyledField>
              <FieldTitle variant={"subtitle2"}>Latest Version</FieldTitle>
              <Typography data-testid={"latest-version"}>
                {latestVersion.latestVersion}
              </Typography>
            </StyledField>
            <StyledField>
              <FieldTitle variant={"subtitle2"}>Download Instructions</FieldTitle>
              <Typography>
                <Link
                  data-testid={"instruction-url"}
                  href={latestVersion.instructionUrl}
                  underline={"hover"}
                >
                  Click Here
                </Link>
              </Typography>
            </StyledField>
          </>
        )}
      </Box>
    </Card>
  );
}

type RemainingDaysProps = {
  remainingDays?: number | null;
};

function RemainingDaysToUpdate({ remainingDays }: RemainingDaysProps) {
  if (remainingDays === null || remainingDays === undefined) {
    return null;
  }

  const remainingDaysNum = Number(remainingDays);
  return (
    <Typography
      data-testid={"version-remaining-days"}
      color={"#E52648"}
      fontWeight={500}
      gutterBottom
    >
      {remainingDaysNum > 0
        ? `Installed version is out of date. Please update to the latest version within the next ${remainingDays} days or applications will be disabled.`
        : "Installed version is out of date. Please update to the latest version immediately to reactivate applications."}
    </Typography>
  );
}
