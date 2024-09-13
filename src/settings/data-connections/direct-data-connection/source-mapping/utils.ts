import {
  DataConnectorHostSitesFragment,
  DataSourceFieldsFragment
} from "generated-graphql";

export function availableHostSites(
  selectedConnector: DataConnectorHostSitesFragment,
  selectedSourceId: string,
  sources: DataSourceFieldsFragment[]
): string[] {
  if (!selectedConnector.hostVizSiteIds) return [];
  const relatedSources = sources.filter(
    (source) =>
      source.id !== selectedSourceId && source.connector?.id === selectedConnector.id
  );
  return selectedConnector.hostVizSiteIds.filter(
    (id) => !relatedSources.some((source) => source.connectorParams?.siteId === id)
  );
}
