import { BasicInfo } from "./basic-info";
import { Security } from "./security";
import { useCurrentUserMfaQuery, useCurrentUserQuery } from "generated-graphql";
import { SettingContainer, SettingsGrid, SettingsRoot } from "../common";

export function PersonalInfo() {
  const { data: curUserData, error } = useCurrentUserQuery();
  const { data: mfaData, error: mfaErr } = useCurrentUserMfaQuery();

  if (error) throw error;
  if (mfaErr) throw mfaErr;

  const currentUser = curUserData?.currentUser;
  return (
    <SettingsRoot data-testid={"personal-info"}>
      <SettingsGrid>
        {!!currentUser && mfaData?.currentUser && (
          <>
            <SettingContainer>
              <BasicInfo currentUser={currentUser} />
            </SettingContainer>

            <SettingContainer reserveActionSpace>
              <Security currentUser={currentUser} mfa={!!mfaData.currentUser.mfa} />
            </SettingContainer>
          </>
        )}
      </SettingsGrid>
    </SettingsRoot>
  );
}
