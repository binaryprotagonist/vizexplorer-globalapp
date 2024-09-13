import { Environment, isCloud, isOnprem } from "../subscriptions";
import { isAdminBuild } from "../../../utils";
import { SettingContainer } from "../../common";
import {
  AdminCloudLicenseVersion,
  AdminOnpremLicenseVersion,
  AdminOnpremTunnelLicenseVersion,
  OnpremLicenseVersion
} from "./license-version-variants";

type Props = {
  currentEnv: Environment;
  subscriptionEnv: Environment;
};

export function LicenseVersion({ currentEnv, subscriptionEnv }: Props) {
  // Cloud Org License/Version information from Admin build
  if (isAdminBuild() && isCloud(subscriptionEnv)) {
    return (
      <SettingContainer reserveActionSpace>
        <AdminCloudLicenseVersion />
      </SettingContainer>
    );
  }

  // Onprem Org Tunnel/License/Version from Admin build
  if (isAdminBuild() && isCloud(currentEnv) && isOnprem(subscriptionEnv)) {
    return (
      <SettingContainer reserveActionSpace>
        <AdminOnpremTunnelLicenseVersion />
      </SettingContainer>
    );
  }

  // Onprem Org License/Version from Admin build
  if (isAdminBuild() && isOnprem(currentEnv) && isOnprem(subscriptionEnv)) {
    return (
      <SettingContainer>
        <AdminOnpremLicenseVersion />
      </SettingContainer>
    );
  }

  // Onprem Org License/Version from App build
  if (isOnprem(currentEnv) && isOnprem(subscriptionEnv)) {
    return (
      <SettingContainer>
        <OnpremLicenseVersion />
      </SettingContainer>
    );
  }

  return null;
}
