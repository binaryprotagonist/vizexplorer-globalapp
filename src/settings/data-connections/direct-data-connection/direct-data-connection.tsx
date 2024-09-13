import { useState } from "react";
import { DataConnectionTable } from "./data-connection-table";
import {
  AppId,
  DataSourceFieldsFragment,
  useCurrentUserQuery,
  useOdrDataConnectorsQuery,
  useOdrDataSourcesQuery
} from "generated-graphql";
import { SourceMapping } from "./source-mapping";
import { DataConnectionTableSkeleton } from "../common";

type Props = {
  appId: AppId;
};

export function DirectDataConnection({ appId }: Props) {
  const [manageSource, setManageSource] = useState<DataSourceFieldsFragment | null>(null);

  const {
    data: curUserData,
    loading: curUserLoading,
    error: currUserErr
  } = useCurrentUserQuery();
  const {
    data: sourcesData,
    loading: sourcesLoading,
    error: sourcesErr
  } = useOdrDataSourcesQuery({ fetchPolicy: "cache-and-network" });
  const {
    data: connectorsData,
    loading: connectorsLoading,
    error: connectorsErr
  } = useOdrDataConnectorsQuery();

  if (currUserErr) throw currUserErr;
  if (sourcesErr) throw sourcesErr;
  if (connectorsErr) throw connectorsErr;

  const loading = curUserLoading || sourcesLoading || connectorsLoading;

  const sources = sourcesData?.odrDataSources || [];
  const sourcesForApp = sources.filter((source) => source.app?.id === appId);
  const connectors = connectorsData?.odrDataConnectors || [];

  return (
    <>
      {manageSource && (
        <SourceMapping
          source={manageSource}
          connectors={connectors}
          sources={sourcesForApp}
          onClose={() => setManageSource(null)}
        />
      )}
      {loading ? (
        <DataConnectionTableSkeleton data-testid={"direct-data-connection-loading"} />
      ) : (
        <DataConnectionTable
          currentUser={curUserData!.currentUser!}
          dataSources={sourcesForApp}
          dataConnectors={connectors}
          onClickEdit={(source) => setManageSource(source)}
        />
      )}
    </>
  );
}
