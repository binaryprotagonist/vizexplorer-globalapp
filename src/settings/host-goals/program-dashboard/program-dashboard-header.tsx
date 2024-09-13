import { gql } from "@apollo/client";
import { Box, Divider, styled, useTheme } from "@mui/material";
import { ProgramDashboardHeaderMetaFragment } from "./__generated__/program-dashboard-header";
import { Paper, Tooltip, Typography, useGlobalTheme } from "@vizexplorer/global-ui-v2";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import { ProgramStatusTag } from "../program-status-tag";
import { formatDateString, isActiveProgramStatus } from "../utils";
import { isSameDay, parseISO } from "date-fns";

const TitleStatusContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  columnGap: theme.spacing(2),
  marginRight: theme.spacing(2),
  overflow: "hidden"
}));

const AttributeContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateRows: "1fr 1fr",
  gridAutoFlow: "column",
  gridTemplateColumns: "max-content",
  columnGap: theme.spacing(12.5),
  rowGap: theme.spacing(1.5),
  padding: theme.spacing(2)
}));

type Props = {
  meta: ProgramDashboardHeaderMetaFragment;
  siteName: string;
};

export function ProgramDashboardHeader({ meta, siteName }: Props) {
  const theme = useTheme();
  const globalTheme = useGlobalTheme();
  const { name, status, startDate, endDate, createdAt, modifiedAt } = meta;

  return (
    <Paper data-testid={"program-dashboard-header"}>
      <Box p={theme.spacing(2)}>
        <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
          <TitleStatusContainer>
            <Tooltip title={name} enterDelay={500} enterNextDelay={500}>
              <Typography noWrap variant={"h4"} fontWeight={700}>
                {name}
              </Typography>
            </Tooltip>
            {isActiveProgramStatus(status) && <ProgramStatusTag status={status} />}
          </TitleStatusContainer>
          <Box display={"flex"} columnGap={theme.spacing(1)}>
            <ApartmentRoundedIcon sx={{ fill: globalTheme.colors.grey[500] }} />
            <Typography noWrap>{siteName}</Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      <AttributeContainer data-testid={"program-attributes"}>
        <Attribute
          data-testid={"start-date"}
          title={"Start date"}
          value={formatDateString(startDate)}
        />
        <Attribute
          data-testid={"end-date"}
          title={"End date"}
          value={formatDateString(endDate)}
        />
        <Attribute
          data-testid={"creation-date"}
          title={"Creation date"}
          value={formatDateString(createdAt)}
        />
        <Attribute
          data-testid={"last-update"}
          title={"Last update"}
          value={lastUpdated(createdAt, modifiedAt)}
          placeholder={"no updates since creation"}
        />
      </AttributeContainer>
    </Paper>
  );
}

ProgramDashboardHeader.fragments = {
  headerMeta: gql`
    fragment ProgramDashboardHeaderMeta on PdGoalProgram {
      name
      status
      startDate
      endDate
      createdAt
      modifiedAt
    }
  `
};

type AttributeProps = {
  title: string;
  value?: string | null;
  placeholder?: string;
};

function Attribute({ title, value, placeholder, ...rest }: AttributeProps) {
  const globalTheme = useGlobalTheme();

  return (
    <Typography variant={"bodySmall"} fontWeight={600} {...rest}>
      {title}:{" "}
      <Typography
        display={"inline"}
        variant={"bodySmall"}
        component={"span"}
        {...(!value && { color: globalTheme.colors.grey[500], fontStyle: "italic" })}
      >
        {value ?? placeholder}
      </Typography>
    </Typography>
  );
}

function lastUpdated(creationDate: string, modifiedAt?: string) {
  if (!modifiedAt || isSameDay(parseISO(creationDate), parseISO(modifiedAt))) {
    return null;
  }

  return formatDateString(modifiedAt);
}
