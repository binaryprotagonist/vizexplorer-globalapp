import { Subscriptions } from "./subscriptions";
import { PaymentInfo } from "./payment-info";
import {
  useApplicationSubscriptionsQuery,
  useCompanyQuery,
  useCurrentUserQuery
} from "generated-graphql";
import { useEnvironment } from "../../view/hooks";
import { SettingContainer, SettingsGrid, SettingsRoot } from "../common";
import { isAdminBuild } from "../../utils";
import { LicenseVersion } from "./license-version";

export function Subscription() {
  const { data: companyData, error: companyError } = useCompanyQuery();
  const { data: currentUserData, error: curUserError } = useCurrentUserQuery();
  const { data: subData, error: subscriptionErr } = useApplicationSubscriptionsQuery();
  const {
    subscriptionEnvironment,
    currentEnvironment,
    loading: envLoading,
    error: envErr
  } = useEnvironment();

  if (companyError) throw companyError;
  if (curUserError) throw curUserError;
  if (subscriptionErr) throw subscriptionErr;
  if (envErr) throw envErr;

  const currentUser = currentUserData?.currentUser;
  const company = companyData?.currentOrg?.company;

  return (
    <SettingsRoot data-testid={"subscription"}>
      {company && currentUser && subData && !envLoading && (
        <SettingsGrid>
          <LicenseVersion
            currentEnv={currentEnvironment!}
            subscriptionEnv={subscriptionEnvironment!}
          />

          <SettingContainer reserveActionSpace={!isAdminBuild()}>
            <Subscriptions
              currentUser={currentUser}
              appSubscriptions={subData.appSubscriptions}
              companyName={company.name}
            />
          </SettingContainer>

          <SettingContainer>
            <PaymentInfo currentUser={currentUser} company={company} />
          </SettingContainer>
        </SettingsGrid>
      )}
    </SettingsRoot>
  );
}
