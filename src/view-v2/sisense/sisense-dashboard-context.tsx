import { ApolloError, gql } from "@apollo/client";
import { SisenseDashWrapper } from "./sisense-dash-wrapper";
import { SisenseDashboardFilter } from "./types";
import { createContext, useContext, useEffect, useState } from "react";
import { updateMetadataItemValue } from "./utils";
import { useSisense } from "./sisense-context";
import { displayCurrency } from "../../view/utils";
import {
  useDashboardResetMutation,
  useSiteLazyQuery
} from "./__generated__/sisense-dashboard-context";

export type SisenseDashboardCtx = {
  dashboard: SisenseDashWrapper | null;
  loaded: boolean;
  loading: boolean;
  error?: Error | ApolloError | null;
};

export const SisenseDashboardContext = createContext<SisenseDashboardCtx | null>(null);

type Props = {
  dashboardId?: string;
  siteId?: string;
  filters?: SisenseDashboardFilter[];
  children: React.ReactNode;
};

export function SisenseDashboardProvider({
  dashboardId,
  siteId,
  filters = [],
  children
}: Props) {
  const [ready, setReady] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    loadDashboard,
    dashboard,
    loaded,
    loading: loadingDashboard,
    error: dashboardErr,
    sisenseReady,
    initSisense
  } = useSisenseDashboard();

  // try load SisenseJS if not already loaded
  useEffect(() => {
    initSisense();
  }, []);

  // Reset dashboard and apply currency
  useEffect(() => {
    if (!dashboardId || !siteId || !sisenseReady) return;
    const abortController = new AbortController();
    loadDashboard(dashboardId, siteId, abortController.signal);

    return () => {
      abortController.abort("component unmounted");
    };
  }, [dashboardId, siteId, sisenseReady]);

  // Apply filters
  useEffect(() => {
    if (!dashboard) return;
    const missingFilters = filters
      .filter(({ fieldTitle }) => !dashboard.filters.findByTitle(fieldTitle))
      .map(({ fieldTitle }) => fieldTitle);
    if (missingFilters.length) {
      setError(Error(`Missing filters: ${missingFilters.join(", ")}`));
      return;
    }

    filters.forEach((filter) => {
      const dashboardFilter = dashboard.filters.findByTitle(filter.fieldTitle)!;
      const newFilter = updateMetadataItemValue(dashboardFilter, filter.value);
      dashboard.filters.update(newFilter);
    });
    setReady(true);
  }, [dashboard, filters]);

  const loading = loadingDashboard || !sisenseReady;

  return (
    <SisenseDashboardContext.Provider
      value={{
        dashboard: dashboard ?? null,
        loaded,
        loading: loading || !ready,
        error: error || dashboardErr
      }}
    >
      {children}
    </SisenseDashboardContext.Provider>
  );
}

export function useSisenseDashboardContext() {
  const context = useContext(SisenseDashboardContext);
  if (!context) {
    throw new Error(`Missing SisenseDashboardProvider`);
  }
  return context;
}

export function useSisenseDashboard() {
  const [dashboardWrapper, setDashboardWrapper] = useState<SisenseDashWrapper>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  const { sisense, prism, ready: sisenseReady, init: initSisense } = useSisense();
  const [loadSite, { error: siteErr }] = useSiteLazyQuery();
  const [resetDashboard, { error: resetErr }] = useDashboardResetMutation();

  async function loadDashboard(
    dashboardId: string,
    siteId: string,
    signal: AbortSignal
  ): Promise<SisenseDashWrapper | undefined> {
    if (!sisense || !prism) {
      console.error("Sisense not ready");
      return;
    }
    setLoading(true);
    setDashboardWrapper(undefined);

    const { data: siteData } = await loadSite({ variables: { id: siteId } });
    const site = siteData?.site;
    if (!site || signal?.aborted) return;

    const { data: resetData } = await resetDashboard({
      variables: { id: dashboardId, siteId: Number(siteId) }
    });
    if (!resetData?.odrDashboardReset || signal?.aborted) return;

    const dashboard = await sisense.dashboards.load(dashboardId);
    prism.vodCurrencyUpdate(displayCurrency(site.currency?.code, "symbol"));

    if (signal?.aborted) {
      dashboard.$$model.destroy();
      return;
    }

    const dashboardWrapper = new SisenseDashWrapper(dashboard);
    setDashboardWrapper(dashboardWrapper);
    setLoading(false);
    setLoaded(true);
    return dashboardWrapper;
  }

  useEffect(() => {
    if (!dashboardWrapper) return;

    return () => {
      dashboardWrapper.destroy();
    };
  }, [dashboardWrapper]);

  return {
    dashboard: dashboardWrapper,
    error: resetErr ?? siteErr,
    loading,
    loaded,
    sisenseReady,
    loadDashboard,
    initSisense
  };
}

const _SITE_QUERY = gql`
  query site($id: ID!) {
    site(idV2: $id) {
      id: idV2
      currency {
        code
      }
    }
  }
`;

const _DASHBOARD_RESET_MUTATION = gql`
  mutation dashboardReset($id: ID!, $siteId: Int!) {
    odrDashboardReset(id: $id) {
      id
      filtersBySite(siteId: $siteId) {
        variant
      }
    }
  }
`;
