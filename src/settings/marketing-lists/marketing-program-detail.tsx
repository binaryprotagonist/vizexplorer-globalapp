import { Box, useTheme } from "@mui/material";
import { GlobalTheme, Typography, useGlobalTheme } from "@vizexplorer/global-ui-v2";
import { gql } from "@apollo/client";
import { formatDateString } from "./utils";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import React from "react";
import { MarketingProgramCardProgramDetailFragment } from "./__generated__/marketing-program-detail";

type ProgramDetailProps = {
  programDetail: MarketingProgramCardProgramDetailFragment;
};

export function MarketingProgramDetail({ programDetail }: ProgramDetailProps) {
  const theme = useTheme();
  const { startDate, dueDate, modifiedAt, guestsSelected, actionsCreated } =
    programDetail;

  return (
    <Box
      data-testid={"marketing-program-detail"}
      display={"flex"}
      flexDirection={"column"}
    >
      <Box
        display={"grid"}
        gridTemplateColumns={"1fr 1fr"}
        columnGap={theme.spacing(4)}
        padding={theme.spacing(2)}
      >
        <ProgramInfo
          data-testid={"guests-selected"}
          title="Guests selected"
          value={guestsSelected}
          icon={<AccountCircleRoundedIcon />}
        />
        <ProgramInfo
          data-testid={"program-modified-date"}
          title="Last modified"
          value={formatDateString(modifiedAt)}
          icon={<CalendarMonthRoundedIcon />}
        />
        <ProgramInfo
          data-testid={"program-start-date"}
          title="Start date"
          value={formatDateString(startDate)}
          icon={<CalendarMonthRoundedIcon />}
        />
        <ProgramInfo
          data-testid={"actions-created"}
          title="Actions created"
          value={actionsCreated}
          icon={<ChecklistRoundedIcon />}
        />
        <ProgramInfo
          data-testid={"program-due-date"}
          title="Due date"
          value={formatDateString(dueDate)}
          icon={<CalendarMonthRoundedIcon />}
        />
      </Box>
    </Box>
  );
}

type ProgramInfoProps = {
  title: string;
  value: string | number;
  icon: React.ReactElement;
};

function ProgramInfo({ title, value, icon, ...rest }: ProgramInfoProps) {
  const theme = useTheme();
  const globalTheme = useGlobalTheme();

  const getIconSX = (theme: GlobalTheme): React.CSSProperties => ({
    fill: theme.colors.grey[500]
  });

  return (
    <Box display="flex" p={theme.spacing(0.5, 2)}>
      {React.cloneElement(icon, { sx: getIconSX(globalTheme) })}
      <Typography variant="bodySmall" fontWeight={600} mx={1}>
        {title}:
      </Typography>
      <Typography variant="bodySmall" {...rest}>
        {value}
      </Typography>
    </Box>
  );
}

MarketingProgramDetail.fragments = {
  marketingProgramDetail: gql`
    fragment MarketingProgramCardProgramDetail on PdMarketingProgram {
      startDate
      dueDate
      modifiedAt
      guestsSelected
      actionsCreated
    }
  `
};
