import {
  Box,
  Pagination,
  PaginationItem,
  paginationItemClasses,
  styled
} from "@mui/material";
import { Button, GlobalTheme, useGlobalTheme } from "@vizexplorer/global-ui-v2";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { ITEMS_PER_PAGE } from "./utils";

const StyledPaginationItem = styled(PaginationItem, {
  shouldForwardProp: (prop) => prop !== "globalTheme"
})<{ globalTheme: GlobalTheme }>(({ globalTheme }) => ({
  fontFamily: globalTheme.fontFamily,
  fontSize: "14px",
  color: globalTheme.colors.grey[600],
  [`&.${paginationItemClasses.selected}`]: {
    color: "#000",
    backgroundColor: globalTheme.colors.grey[50],
    fontWeight: 600,
    ["&:hover"]: {
      backgroundColor: globalTheme.colors.grey[200]
    }
  },
  ["&:hover"]: {
    backgroundColor: globalTheme.colors.grey[200]
  }
}));

type Props = {
  // 0 indexed
  page: number;
  numPages: number;
  loading?: boolean;
  onPageChange: (e: any, page: number) => void;
};

export function TablePagination({ page, numPages, loading, onPageChange }: Props) {
  const globalTheme = useGlobalTheme();

  return (
    <td data-testid={"table-pagination"}>
      <Box
        display={"flex"}
        columnGap={"24px"}
        justifyContent={"space-between"}
        alignItems={"center"}
        p={"12px 24px 16px 24px"}
      >
        <Button
          variant={"outlined"}
          color={"neutral"}
          size={"small"}
          onClick={(e) => onPageChange(e, page - 1)}
          disabled={page === 0 || loading}
          startIcon={<ArrowBackRoundedIcon />}
        >
          Previous
        </Button>

        <Pagination
          hideNextButton
          hidePrevButton
          page={page + 1}
          // display a placeholder number of pages while loading
          count={loading ? ITEMS_PER_PAGE : numPages}
          shape={"rounded"}
          disabled={loading}
          onChange={(e, page) => onPageChange(e, page - 1)}
          renderItem={(props) => (
            <StyledPaginationItem {...props} size={"large"} globalTheme={globalTheme} />
          )}
        />

        <Button
          variant={"outlined"}
          color={"neutral"}
          size={"small"}
          onClick={(e) => onPageChange(e, page + 1)}
          disabled={page === numPages - 1 || !numPages || loading}
          endIcon={<ArrowForwardRoundedIcon />}
        >
          Next
        </Button>
      </Box>
    </td>
  );
}
