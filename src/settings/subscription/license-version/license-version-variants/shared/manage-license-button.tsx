import { Edit } from "@mui/icons-material";
import { SettingAction } from "../../../../common";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  disabled?: boolean;
  tooltip?: string;
};

export function ManageLicenseButton({ disabled, tooltip }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleManageLicenseClick() {
    if (disabled) return;
    navigate("../license/manage", {
      state: { prevPage: location.pathname }
    });
  }

  return (
    <SettingAction
      data-testid={"manage-license-button"}
      startIcon={<Edit />}
      color={"primary"}
      onClick={handleManageLicenseClick}
      disabled={disabled}
      tooltip={tooltip}
    >
      Manage License
    </SettingAction>
  );
}
