import { ReactElement } from "react";
import { useConfig } from "../config";
import pkg from "../../../package.json";
import { PendoProvider as GlobalPendoProvider } from "@vizexplorer/global-ui-core";

export function PendoProvider({ children }: { children: ReactElement }) {
  const { pendo: pendoConfig } = useConfig();

  if (!pendoConfig.enabled) {
    return children;
  }

  const appConfig = { name: pkg.name, version: pkg.version };
  const pConfig = {
    apiKey: pendoConfig.apiKey!,
    account: pendoConfig.account!
  };
  return (
    <GlobalPendoProvider
      enabled={pendoConfig.enabled}
      appConfig={appConfig}
      pendoConfig={pConfig}
    >
      {children}
    </GlobalPendoProvider>
  );
}
