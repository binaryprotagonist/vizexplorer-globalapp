import { MTableBodyRow } from "@material-table/core";
import { ActionProps, BasicAction, BasicMaterialTable } from "../../../../view/table";
import { AppSubscriptionFragment, GaUserFragment, Site } from "generated-graphql";
import { TableContainer } from "../../../common";
import { subscriptionColumns } from "./columns";
import { SubscriptionAction } from "../types";
import { canUser } from "../../../../view/user/utils";
import { UserActionType } from "../../../../view/user/types";
import { Box } from "@mui/material";

type Props = {
  currentUser: GaUserFragment;
  appSubscriptions: AppSubscriptionFragment[];
  companyName: string;
};

export function SubscriptionTable({ currentUser, appSubscriptions, companyName }: Props) {
  const actions: SubscriptionAction[] = [
    () => {
      const disabled = !canUser(currentUser, {
        type: UserActionType.MANAGE_SUBSCRIPTION
      });

      return {
        icon: "Edit",
        onClick: () =>
          window.open("https://www.vizexplorer.com/request-an-upgrade", "_blank"),
        disabled,
        tooltip: disabled
          ? "You don't have permission to manage Subscriptions. Please contact an Org Admin"
          : ""
      };
    },
    () => {
      const disabled = !canUser(currentUser, {
        type: UserActionType.MANAGE_SUBSCRIPTION
      });

      return {
        icon: "Cancel",
        onClick: () =>
          window.open("https://www.vizexplorer.com/request-an-upgrade", "_blank"),
        disabled,
        tooltip: disabled
          ? "You don't have permission to manage Subscriptions. Please contact an Org Admin"
          : ""
      };
    }
  ];

  return (
    <Box data-testid={"subscription-table"}>
      <BasicMaterialTable
        components={{
          Container: TableContainer,
          Action: (props: ActionProps<Site>) => <BasicAction {...props} />,
          Row: (props) => <MTableBodyRow data-testid={"user-row"} {...props} />
        }}
        title={`${companyName} Subscriptions`}
        columns={subscriptionColumns}
        data={appSubscriptions}
        actions={actions}
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
    </Box>
  );
}
