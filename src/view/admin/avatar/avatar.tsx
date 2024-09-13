import { useState } from "react";
import {
  AvatarBase,
  AvatarMenuBase,
  AvatarMenuItem,
  useAuth,
  UserDetails
} from "@vizexplorer/global-ui-core";

function userInitials(user: UserDetails | null) {
  const firstIntitial = user?.firstName[0] || "";
  const lastIntitial = user?.lastName[0] || "";
  const initials = `${firstIntitial}${lastIntitial}`;

  return initials.toUpperCase();
}

export function Avatar() {
  const { signOut, getUserInfo } = useAuth();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  return (
    <>
      <AvatarBase
        data-testid={"admin-avatar"}
        initials={userInitials(getUserInfo())}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      />
      <AvatarMenuBase
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <AvatarMenuItem onClick={signOut} closeMenuOnSelect>
          Logout
        </AvatarMenuItem>
      </AvatarMenuBase>
    </>
  );
}
