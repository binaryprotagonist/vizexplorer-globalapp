import { useMemo } from "react";
import { Column, MTableBodyRow } from "@material-table/core";
import { ActionProps, BasicAction, BasicMaterialTable } from "../../../view/table";
import { CenteredCell, TableContainer } from "../../common";
import { Box, Skeleton } from "@mui/material";
import { LoyaltyTierFragment } from "generated-graphql";

type Props = {
  tiers: LoyaltyTierFragment[];
  loading: boolean;
};

export function LoyaltyTiersTable({ tiers, loading }: Props) {
  const columns: Column<LoyaltyTierFragment>[] = useMemo(
    () => [
      {
        title: "Rank Order",
        render: (tier) => <CenteredCell>{tier.order}</CenteredCell>,
        customSort: (t1, t2) => {
          const t1Ord = t1.order;
          const t2Ord = t2.order;
          return t1Ord === t2Ord ? 0 : t1Ord > t2Ord ? 1 : -1;
        },
        customFilterAndSearch: (search, tier) => search.includes(`${tier.order}`),
        defaultSort: "asc",
        cellStyle: { textAlign: "center" },
        headerStyle: { textAlign: "center" },
        width: "150px"
      },
      {
        title: "Tier Name",
        field: "name",
        sorting: false,
        cellStyle: { textAlign: "center" },
        headerStyle: { textAlign: "center" },
        width: "400px"
      },
      {
        title: "Color",
        render: (tier) => (
          <Box
            data-testid={"tier-table-color"}
            width={"60px"}
            height={"24px"}
            margin={"auto"}
            borderRadius={"4px"}
            sx={{ backgroundColor: tier.color }}
          />
        ),
        sorting: false,
        cellStyle: { textAlign: "center" },
        headerStyle: { textAlign: "center" },
        width: "150px"
      },
      { sorting: false }
    ],
    []
  );

  if (loading) {
    return <LoadingTable />;
  }

  return (
    <>
      <span data-testid={"loyalty-tiers-table"} />
      <BasicMaterialTable
        components={{
          Container: TableContainer,
          Action: (props: ActionProps<LoyaltyTierFragment>) => <BasicAction {...props} />,
          Row: (props) => <MTableBodyRow data-testid={"loyalty-tiers-row"} {...props} />
        }}
        title={"Loyalty Tiers"}
        columns={columns}
        data={tiers}
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
    </>
  );
}

function LoadingTable() {
  return (
    <TableContainer>
      <Box data-testid={"loyalty-tiers-loading"} padding={"12px"} marginTop={"12px"}>
        <Skeleton
          variant={"rectangular"}
          width={260}
          height={40}
          sx={{ margin: "0 18px 18px auto" }}
        />
        <Skeleton variant={"rectangular"} width={"100%"} height={200} />
      </Box>
    </TableContainer>
  );
}
