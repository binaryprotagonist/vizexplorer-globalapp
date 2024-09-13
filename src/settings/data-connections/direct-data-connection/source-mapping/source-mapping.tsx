import { useEffect, useState } from "react";
import { DataConnectorFieldsFragment, DataSourceFieldsFragment } from "generated-graphql";
import { SourceMappingDialog } from "./source-mapping-dialog";
import { ManageConnectorDialog } from "../manage-connector";
import { ManageConnectorAction } from "./types";

type Props = {
  source: DataSourceFieldsFragment;
  sources: DataSourceFieldsFragment[];
  connectors: DataConnectorFieldsFragment[];
  onClose: VoidFunction;
};

export function SourceMapping({ source, sources, connectors, onClose }: Props) {
  const [selectedConn, setSelectedConn] = useState<DataConnectorFieldsFragment | null>(
    null
  );
  const [manageConnector, setManageConnector] = useState<ManageConnectorAction | null>(
    null
  );

  useEffect(() => {
    const conn = connectors.find((conn) => conn.id === source.connector?.id);
    setSelectedConn(conn || null);
  }, [source]);

  function onConnectorClose(connector?: DataConnectorFieldsFragment) {
    if (connector) setSelectedConn(connector);
    setManageConnector(null);
  }

  return (
    <>
      <SourceMappingDialog
        open={!manageConnector}
        selectedSource={source}
        sources={sources}
        selectedConnector={selectedConn}
        connectors={connectors}
        onConnectorChange={(change) => {
          switch (change.type) {
            case "new":
              setManageConnector({ type: "add" });
              break;
            case "edit":
              setManageConnector({ type: "edit", connector: change.value });
              break;
            case "change":
              setSelectedConn(change.value);
              break;
          }
        }}
        onClose={onClose}
      />
      {manageConnector && (
        <ManageConnectorDialog
          connector={
            manageConnector.type === "add"
              ? null
              : connectors.find((conn) => conn.id === manageConnector.connector.id)!
          }
          onClose={onConnectorClose}
        />
      )}
    </>
  );
}
