import {
  AdminOnpremTunnelsDocument,
  AdminOnpremTunnelsQuery
} from "../__generated__/admin-onprem-tunnel-license-version";

export type AdminOnpremTunnelsQueryOpts = {
  tunnelUrls?: string[];
};

export function mockAdminOnpremTunnelsQuery({
  tunnelUrls
}: AdminOnpremTunnelsQueryOpts = {}) {
  const data: AdminOnpremTunnelsQuery = {
    currentOrg: {
      __typename: "Org",
      id: "1",
      onPremTunnels: (tunnelUrls ?? []).map((tunnelUrl) => ({
        __typename: "OrgOnPremTunnel",
        url: tunnelUrl
      }))
    }
  };

  return {
    request: {
      query: AdminOnpremTunnelsDocument
    },
    result: {
      data
    }
  };
}
