import { Typography } from "@mui/material";
import { HelpTip } from "../../common";

type Props = {
  settingInfo: string[];
};

export function SettingHelp({ settingInfo }: Props) {
  if (!settingInfo.length) return null;

  return (
    <HelpTip
      data-testid={"setting-help"}
      placement={"right"}
      title={settingInfo.map((info, idx, arr) => (
        <Typography
          key={`setting-info-${idx}`}
          fontSize={"12px"}
          gutterBottom={idx + 1 !== arr.length}
        >
          {info}
        </Typography>
      ))}
    />
  );
}
