import { useCallback, useMemo } from "react";
import { GaUserFragment } from "generated-graphql";
import { Action } from "@material-table/core";
import { canUser } from "../../../view/user/utils";
import { UserActionType } from "../../../view/user/types";
import { Table } from "view-v2/table";
import { EditRounded } from "@mui/icons-material";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import {
  HostMappingSiteFragment,
  HostMappingUsersFragment
} from "./__generated__/host-mapping";
import { createHostMappingColumns } from "./host-mapping-columns";
import { Select } from "view-v2/select";
import { CustomToolbarProps } from "view-v2/table/toolbar/table-toolbar";

type Props = {
  currentUser: GaUserFragment | null;
  site: HostMappingSiteFragment | null;
  siteOptions: HostMappingSiteFragment[];
  userHostMapping: HostMappingUsersFragment[];
  loading: boolean;
  onClickEdit: (userId: string, siteId: string) => void;
  onSiteChange: (site: HostMappingSiteFragment) => void;
};

export function HostMappingTable({
  currentUser,
  site,
  siteOptions,
  userHostMapping,
  loading,
  onClickEdit,
  onSiteChange
}: Props) {
  const columns = useMemo(() => createHostMappingColumns(), []);
  const actions: ((
    mapping: HostMappingUsersFragment
  ) => Action<HostMappingUsersFragment>)[] = [
    (mapping) => {
      const disabled =
        !currentUser ||
        !site ||
        !canUser(currentUser, {
          type: UserActionType.EDIT_HOST_MAPPING,
          siteId: site.id
        });

      return {
        icon: () => <EditRounded />,
        onClick: () => onClickEdit(mapping.id, site!.id),
        disabled: loading || disabled,
        buttonProps: { "data-testid": "edit-host-mappings" },
        tooltip: loading
          ? "Loading..."
          : disabled
            ? "You don't have permission to Edit Host Mappings. Please contact an Org Admin"
            : ""
      };
    }
  ];
  const customToolbar = useCallback(
    ({ ToolbarContainer, search }: CustomToolbarProps) => {
      return (
        <ToolbarContainer>
          <SiteDropdown
            selectedSite={site}
            options={siteOptions}
            onChange={onSiteChange}
            loading={loading}
          />
          {search}
        </ToolbarContainer>
      );
    },
    [site, siteOptions, loading]
  );

  return (
    <>
      <span data-testid={"host-mapping-table"} />
      <Table
        columns={columns}
        loading={loading}
        data={userHostMapping}
        actions={actions}
        toolbar={{ type: "custom", component: customToolbar }}
      />
    </>
  );
}

type SiteDropdownProps = {
  selectedSite: HostMappingSiteFragment | null;
  options: HostMappingSiteFragment[];
  onChange: (site: HostMappingSiteFragment) => void;
  loading: boolean;
};

function SiteDropdown({ selectedSite, options, onChange, loading }: SiteDropdownProps) {
  return (
    <Select
      data-testid={"site-dropdown"}
      // @ts-ignore allow null
      value={selectedSite}
      options={options}
      disabled={loading}
      placeholder={"Select property"}
      sx={{ width: "255px" }}
      startAdornment={<ApartmentRoundedIcon sx={{ fill: "grey.500" }} />}
      onChange={(_e, value) => onChange(value)}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
    />
  );
}
