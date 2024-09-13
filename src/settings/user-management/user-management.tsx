import { Box } from "@mui/material";
import { Tab, Tabs, Typography } from "@vizexplorer/global-ui-v2";
import { useState } from "react";
import { USER_MANAGEMENT_VIEWS, UserManagementView } from "./types";
import { userManagementTabLabel } from "./utils";
import { HostMapping } from "./host-mapping";
import { Users } from "./users";
import { UserGroups } from "./user-groups";
import { useUserManagementPermission } from "./user-management-permission";
import { PageContainer } from "view-v2/page";

export function UserManagement() {
  const [view, setView] = useState<UserManagementView>("users");
  const { canAccessUserManagementTabs, loading, error } = useUserManagementPermission();

  if (error) {
    throw error;
  }

  return (
    <PageContainer data-testid={"user-management"} overflow={"auto"}>
      <Typography variant={"h1"} fontWeight={700} mb={4}>
        User Management
      </Typography>

      {canAccessUserManagementTabs && !loading && (
        <ViewToggle
          data-testid={"view-tabs"}
          view={view}
          options={[...USER_MANAGEMENT_VIEWS]}
          onChange={setView}
        />
      )}

      <Box>
        {view === "users" && <Users />}
        {view === "user-groups" && <UserGroups />}
        {view === "host-code-mapping" && <HostMapping />}
      </Box>
    </PageContainer>
  );
}

type ViewToggleProps = {
  view: UserManagementView;
  options: UserManagementView[];
  onChange: (view: UserManagementView) => void;
};

function ViewToggle({ view, onChange, options = [], ...rest }: ViewToggleProps) {
  return (
    <Box mb={4}>
      <Tabs value={view} onChange={(_, value) => onChange(value)} {...rest}>
        {options.map((type) => (
          <Tab
            key={`user-management-${type}`}
            data-testid={`user-management-tab-${type}`}
            label={userManagementTabLabel(type)}
            value={type}
            sx={{ minWidth: "263px" }}
          />
        ))}
      </Tabs>
    </Box>
  );
}
