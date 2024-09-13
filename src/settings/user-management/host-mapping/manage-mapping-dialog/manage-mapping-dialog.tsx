import { gql } from "@apollo/client";
import {
  Dialog,
  DialogHeader,
  InputLabel,
  LoadingButton
} from "@vizexplorer/global-ui-v2";
import {
  UserMappingFragmentDoc,
  useHostMappingUpdateMutation,
  useSiteQuery,
  useUnmappedNativeHostsQuery,
  useUserQuery
} from "./__generated__/manage-mapping-dialog";
import { Box, Skeleton, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { UserDisplay } from "../../../../view/user/utils";
import { HostCodeSelect } from "./host-code-select";
import { HostSelectOption } from "./types";
import {
  buildMappingOptions,
  mappingAsOption,
  mappingUpdateVariables,
  mappingCacheUpdate
} from "./utils";
import { useAlert } from "view-v2/alert";

const ContentContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  padding: theme.spacing(0, 2, 3, 2)
}));

type Props = {
  userId: string;
  siteId: string;
  onSave: VoidFunction;
  onClose: VoidFunction;
};

export function ManageMappingDialog({ userId, siteId, onSave, onClose }: Props) {
  const [selectedMappings, setSelectedMappings] = useState<HostSelectOption[]>([]);
  const [mappingOptions, setMappingOptions] = useState<HostSelectOption[]>([]);
  const { addAlert } = useAlert();

  const {
    data: userData,
    loading: userLoading,
    error: userErr
  } = useUserQuery({
    variables: { id: userId },
    fetchPolicy: "cache-and-network"
  });
  const {
    data: siteData,
    loading: siteLoading,
    error: siteErr
  } = useSiteQuery({
    variables: { id: siteId },
    fetchPolicy: "cache-and-network"
  });
  const {
    data: unmappedNativeHostsData,
    loading: unmappedNativeHostsLoading,
    error: unmappedNativeHostsErr
  } = useUnmappedNativeHostsQuery({
    variables: { siteId },
    // list changes frequently, so we don't want to rely on any cache records
    fetchPolicy: "no-cache"
  });

  const [updateMapping, { loading: mappingUpdating }] = useHostMappingUpdateMutation({
    onCompleted: () => {
      addAlert({ message: "Changes saved", severity: "success" });
      onSave();
    },
    onError: () => {
      addAlert({
        message: "An unexpected error occurred while saving. Please try again.",
        severity: "error"
      });
    }
  });

  const siteName = siteData?.site?.name ?? "";
  const descriptionLoading = userLoading || siteLoading;
  const userName = userData?.user ? UserDisplay.fullNameV2(userData.user) : "";

  useEffect(() => {
    const userMappings = userData?.user?.pdHostMappings ?? [];
    const mappingsForSite = userMappings.filter((mapping) => mapping.siteId === siteId);
    const unmappedNativeHosts = unmappedNativeHostsData?.pdNativeHosts ?? [];
    const mappedOptions: HostSelectOption[] = mappingsForSite
      .filter((mapping) => mapping.nativeHost)
      .map((mapping) => mappingAsOption(mapping.nativeHost!));
    const combined = buildMappingOptions(unmappedNativeHosts, mappedOptions);

    setMappingOptions(combined);
    setSelectedMappings(mappedOptions);
  }, [userData?.user, unmappedNativeHostsData?.pdNativeHosts]);

  function handleClickSave() {
    updateMapping({
      variables: mappingUpdateVariables(userId, siteId, selectedMappings),
      update: (cache, result) => {
        mappingCacheUpdate(userId, cache, result);
      }
    });
  }

  if (userErr) throw userErr;
  if (siteErr) throw siteErr;
  if (unmappedNativeHostsErr) throw unmappedNativeHostsErr;

  return (
    <Dialog
      data-testid={"manage-mapping-dialog"}
      open
      PaperProps={{
        sx: { width: "400px", height: "620px" }
      }}
    >
      <DialogHeader
        title={"Edit host code mapping"}
        description={
          descriptionLoading ? (
            <Skeleton
              data-testid={"description-loading"}
              variant={"rounded"}
              height={"45px"}
            />
          ) : (
            description(userName, siteName)
          )
        }
        disableClose={mappingUpdating}
        onClickClose={onClose}
      />

      <ContentContainer>
        <Box display={"grid"}>
          <InputLabel>Host codes</InputLabel>
          <HostCodeSelect
            value={selectedMappings}
            options={mappingOptions}
            disabled={userLoading || unmappedNativeHostsLoading || mappingUpdating}
            loading={userLoading || unmappedNativeHostsLoading}
            onChange={setSelectedMappings}
          />
        </Box>

        <LoadingButton
          variant={"contained"}
          size={"large"}
          loading={mappingUpdating}
          disabled={userLoading || unmappedNativeHostsLoading}
          onClick={handleClickSave}
        >
          {mappingUpdating ? "Saving" : "Save"}
        </LoadingButton>
      </ContentContainer>
    </Dialog>
  );
}

function description(userName: string, siteName: string) {
  return `Map host codes for ${userName} on property ${siteName}`;
}

const _USER_QUERY = gql`
  fragment UserMapping on PdHostMapping {
    id
    siteId
    nativeHost {
      ...MappingSelectNativeHost
    }
  }

  query user($id: String!) {
    user(id: $id) {
      id
      firstName
      lastName
      pdHostMappings {
        ...UserMapping
      }
    }
  }
  ${HostCodeSelect.fragments.nativeHost}
`;

const _SITE_QUERY = gql`
  query site($id: ID!) {
    site(idV2: $id) {
      id: idV2
      name
    }
  }
`;

const _UNMAPPED_NATIVE_HOSTS_QUERY = gql`
  query unmappedNativeHosts($siteId: ID!) {
    pdNativeHosts(siteId: $siteId) {
      ...MappingSelectNativeHost
    }
  }
  ${HostCodeSelect.fragments.nativeHost}
`;

const _HOST_MAPPING_UPDATE_MUTATION = gql`
  mutation hostMappingUpdate($input: PdHostMappingUpdateInput!) {
    pdHostMappingUpdate(input: $input) {
      ...UserMapping
    }
    ${UserMappingFragmentDoc}
  }
`;
