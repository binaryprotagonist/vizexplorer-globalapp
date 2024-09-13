import { TableSearch, TableSearchProps } from "./search";
import { TableToolbarContainer } from "./table-toolbar-container";
import { TableToolbarContainerProps } from "./types";

export type CustomToolbarProps = {
  ToolbarContainer: React.ComponentType<TableToolbarContainerProps>;
  search: React.ReactNode;
};

type Props = {
  customToolbar?: (props: CustomToolbarProps) => React.ReactElement | null;
} & TableSearchProps;

export function TableToolbar({ customToolbar, ...rest }: Props) {
  if (customToolbar) {
    return customToolbar({
      ToolbarContainer: TableToolbarContainer,
      search: <TableSearch {...rest} />
    });
  }

  return (
    <TableToolbarContainer>
      <TableSearch {...rest} />
    </TableToolbarContainer>
  );
}
