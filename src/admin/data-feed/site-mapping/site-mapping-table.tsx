import MaterialTable from "@material-table/core";
import { MappingActionFn, MappingData } from "./types";
import { SiteMappingFragment } from "generated-graphql";
import { ActionProps, BasicAction } from "../../../view/table";
import { CenteredCell, TableContainer } from "../../../settings/common";

type Props = {
  siteMapping: SiteMappingFragment[];
  onClickEdit: (mapping: SiteMappingFragment) => void;
};

export function SiteMappingTable({ siteMapping, onClickEdit }: Props) {
  const mappingData = siteMapping.map<MappingData>((mapping) => ({
    id: mapping.id,
    vodProperty: mapping.name,
    sourceProperty: mapping.dataFeedMapping?.sourceSiteId
  }));

  const actions: MappingActionFn[] = [
    (mapping: MappingData) => {
      return {
        icon: "Edit",
        onClick: () => onClickEdit(siteMapping.find((site) => site.id === mapping.id)!)
      };
    }
  ];

  return (
    <MaterialTable<MappingData>
      title={"Property Mapping"}
      columns={[
        {
          title: "VizOndemand Property",
          field: "vodProperty",
          width: "25%",
          defaultSort: "asc"
        },
        {
          title: "Source Property ID",
          render: (mapping) => <CenteredCell>{mapping.sourceProperty}</CenteredCell>,
          customFilterAndSearch: (search, mapping) => {
            if (!mapping.sourceProperty) return false;
            return mapping.sourceProperty
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase());
          },
          customSort: (mappingA, mappingB) => {
            const type1 = mappingA.sourceProperty || "";
            const type2 = mappingB.sourceProperty || "";
            return new Intl.Collator().compare(type1, type2);
          },
          cellStyle: { textAlign: "center" },
          headerStyle: { textAlign: "center" },
          width: "25%"
        },
        { sorting: false }
      ]}
      data={mappingData}
      actions={actions}
      components={{
        Container: (props) => (
          <TableContainer {...props} data-testid={"site-mapping-table"} elevation={0} />
        ),
        Action: (props: ActionProps<MappingData>) => <BasicAction {...props} />
      }}
      options={{
        actionsColumnIndex: -1,
        emptyRowsWhenPaging: false,
        draggable: false
      }}
      localization={{
        header: {
          actions: ""
        }
      }}
    />
  );
}
