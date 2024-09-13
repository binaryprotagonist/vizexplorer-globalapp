import { useEffect, useMemo, useState } from "react";
import { useCurrentUserQuery } from "generated-graphql";
import { sortArray } from "../../../view/utils";
import { HostMappingTable } from "./host-mapping-table";
import { gql } from "@apollo/client";
import {
  HostMappingSiteFragment,
  useGetSitesQuery,
  useUsersNativeHostMappingQuery
} from "./__generated__/host-mapping";
import { buildUserMappingsTableData, sitesWithHostAccess } from "./utils";
import { ManageMappingDialog } from "./manage-mapping-dialog";
import { SomethingWentWrong } from "view-v2/page";

export function HostMapping() {
  const [error, setError] = useState<Error | null>(null);
  const [selectedSite, setSelectedSite] = useState<HostMappingSiteFragment | null>(null);
  const [mappingToEdit, setMappingToEdit] = useState<EditMapping | null>(null);

  const {
    data: sitesData,
    loading: sitesLoading,
    refetch: refetchSites
  } = useGetSitesQuery({ onError: setError, notifyOnNetworkStatusChange: true });
  const {
    data: curUserData,
    loading: curUserLoading,
    refetch: refetchCurrentUser
  } = useCurrentUserQuery({ onError: setError, notifyOnNetworkStatusChange: true });
  const {
    data: userHostData,
    loading: userHostLoading,
    called: userHostCalled,
    refetch: refetchHosts
  } = useUsersNativeHostMappingQuery({
    onError: setError,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true
  });

  const currentUser = curUserData?.currentUser;
  const loading =
    userHostLoading || curUserLoading || sitesLoading || !selectedSite || !userHostCalled;

  const siteOptions: HostMappingSiteFragment[] = useMemo(() => {
    if (!currentUser || !sitesData?.sites) return [];

    const accessibleSites = sitesWithHostAccess(currentUser, sitesData.sites);
    return sortArray(accessibleSites, true, (site) => site.name);
  }, [currentUser, sitesData]);

  const hostMappings = useMemo(() => {
    if (!userHostData?.users || !selectedSite) return [];
    return buildUserMappingsTableData(userHostData.users, selectedSite.id);
  }, [userHostData, selectedSite]);

  useEffect(() => {
    if (selectedSite || !siteOptions.length) return;
    onSiteChange(siteOptions[0]);
  }, [siteOptions]);

  function onSiteChange(site: HostMappingSiteFragment) {
    setSelectedSite(site);
  }

  function handleClickRefresh() {
    setError(null);
    refetchCurrentUser();
    refetchSites();
    refetchHosts();
  }

  function onClickEdit(userId: string, siteId: string) {
    setMappingToEdit({ userId, siteId });
  }

  if (error) {
    return (
      <SomethingWentWrong
        data-testid={"host-mapping-table-error"}
        onClickRefresh={handleClickRefresh}
      />
    );
  }

  return (
    <div>
      {mappingToEdit && (
        <ManageMappingDialog
          userId={mappingToEdit.userId}
          siteId={mappingToEdit.siteId}
          onSave={() => {
            setMappingToEdit(null);
          }}
          onClose={() => {
            setMappingToEdit(null);
          }}
        />
      )}
      <span data-testid={"user-host-mapping"} data-loading={loading} />
      <HostMappingTable
        siteOptions={siteOptions}
        onSiteChange={onSiteChange}
        currentUser={currentUser ?? null}
        site={selectedSite}
        userHostMapping={hostMappings}
        onClickEdit={onClickEdit}
        loading={loading}
      />
    </div>
  );
}

type EditMapping = {
  userId: string;
  siteId: string;
};

const _USERS_NATIVE_HOST_MAPPING_QUERY = gql`
  fragment HostMapping on PdHostMapping {
    id
    siteId
    nativeHostId
  }

  fragment HostMappingUsers on User {
    id
    firstName
    lastName
    email
    phone
    accessLevel
    accessList {
      app {
        id
      }
      site {
        id: idV2
      }
      role {
        id
      }
    }
    pdHostMappings {
      ...HostMapping
    }
  }

  query usersNativeHostMapping {
    users {
      ...HostMappingUsers
    }
  }
`;

const _GET_SITES_QUERY = gql`
  fragment HostMappingSite on Site {
    id: idV2
    name
  }

  query getSites {
    sites {
      ...HostMappingSite
    }
  }
`;
