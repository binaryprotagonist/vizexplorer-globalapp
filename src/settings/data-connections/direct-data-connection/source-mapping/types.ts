import { DataConnectorFieldsFragment } from "generated-graphql";

type EditConnector = {
  type: "edit";
  connector: DataConnectorFieldsFragment;
};

type AddConnector = {
  type: "add";
};

export type ManageConnectorAction = AddConnector | EditConnector;
