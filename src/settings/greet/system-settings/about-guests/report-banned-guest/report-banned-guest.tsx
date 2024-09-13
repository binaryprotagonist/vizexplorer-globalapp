import { Box, Skeleton, menuClasses, styled } from "@mui/material";
import { SettingContent, SettingsCard } from "../../common";
import { aboutGuestsSettingHelp, aboutGuestsSettingTitle } from "../utils";
import { ToggleButton } from "../../../../common";
import { useState } from "react";
import { MenuOption, SettingActionMenu } from "../../../components";
import { GreetReportConfigFragment } from "generated-graphql";
import { Tooltip, Typography, useGlobalTheme } from "@vizexplorer/global-ui-v2";
import { BannedGuestChangeParams } from "./types";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { IconButton } from "view-v2/icon-button";

const StyledSettingActionMenu = styled(SettingActionMenu)({
  [`& .${menuClasses.paper}`]: {
    maxWidth: "250px"
  }
}) as typeof SettingActionMenu;

type Props = {
  config: GreetReportConfigFragment | null;
  onChange: (params: BannedGuestChangeParams) => void;
  onClickEditEmails: VoidFunction;
  loading?: boolean;
};

export function ReportBannedGuest({
  config,
  onChange,
  onClickEditEmails,
  loading
}: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <SettingsCard
      data-testid={"report-banned-guest"}
      title={aboutGuestsSettingTitle("report-banned-guest")}
      helpText={aboutGuestsSettingHelp("report-banned-guest")}
    >
      <SettingContent>
        {loading && (
          <Skeleton variant={"rounded"}>
            <ToggleButton>{MENU_OPTIONS[0].label}</ToggleButton>
          </Skeleton>
        )}
        {!loading && !!config && (
          <Box display={"flex"} alignItems={"center"} overflow={"hidden"}>
            <ToggleButton
              data-testid={"report-banned-action"}
              selected={!!anchorEl}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              {MENU_OPTIONS.find((opt) => opt.value === config?.enabled)?.label}
            </ToggleButton>
            <StyledSettingActionMenu
              data-testid={"report-banned-action-menu"}
              anchorEl={anchorEl}
              title={"Enable reporting when a banned guest cards in"}
              selectedValue={config.enabled}
              options={MENU_OPTIONS}
              onChange={(enabled) => {
                onChange({
                  settingId: "report-banned-guest",
                  value: { enabled, emailRecipients: config.emailRecipients }
                });
                setAnchorEl(null);
              }}
              onClose={() => setAnchorEl(null)}
            />

            {config.enabled && (
              <EmailList
                emails={config.emailRecipients}
                onClickEdit={onClickEditEmails}
              />
            )}
          </Box>
        )}
      </SettingContent>
    </SettingsCard>
  );
}

type EmailListProps = {
  emails: string[];
  onClickEdit: VoidFunction;
};

function EmailList({ emails, onClickEdit }: EmailListProps) {
  const theme = useGlobalTheme();

  return (
    <Box
      data-testid={"email-list"}
      display={"grid"}
      gridTemplateColumns={"max-content auto max-content"}
      columnGap={1}
      alignItems={"center"}
      ml={4}
    >
      <EmailRoundedIcon sx={{ color: theme.colors.grey[500] }} />
      <Tooltip
        followCursor
        title={emails.map((email) => (
          <span key={`email-tooltip-${email}`} style={{ display: "block" }}>
            {email}
          </span>
        ))}
      >
        <Typography noWrap variant={"bodySmall"}>
          {emails.map((email, idx, arr) => (
            <span
              key={`email-list-${email}`}
              style={{ marginRight: idx !== arr.length - 1 ? "16px" : 0 }}
            >
              {email}
            </span>
          ))}
        </Typography>
      </Tooltip>
      <IconButton data-testid={"edit"} size={"small"} onClick={onClickEdit}>
        <EditRoundedIcon sx={{ color: "#000" }} />
      </IconButton>
    </Box>
  );
}

const MENU_OPTIONS: MenuOption<boolean>[] = [
  {
    value: true,
    label: "Yes"
  },
  {
    value: false,
    label: "No"
  }
];
