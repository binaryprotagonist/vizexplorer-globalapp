import { Paper, Tooltip, Typography, useGlobalTheme } from "@vizexplorer/global-ui-v2";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ArrowDropDownCircleRoundedIcon from "@mui/icons-material/ArrowDropDownCircleRounded";
import { RuleActionType } from "./types";
import { Box, Collapse, PaperProps, Skeleton, useTheme } from "@mui/material";
import { ReactElement, forwardRef } from "react";
import { GreetRuleFragment } from "generated-graphql";
import { RuleDetail } from "./rule-detail";
import { Tag } from "view-v2/tag";
import { IconButton } from "view-v2/icon-button";

type Props = {
  loading: false;
  rule: GreetRuleFragment;
  order?: number | null;
  multiproperty?: boolean;
  expanded: boolean;
  onClickAction: (actionType: RuleActionType, rule: GreetRuleFragment) => void;
} & PaperProps;

type LoadingProps = {
  loading: true;
  order?: number | null;
  multiproperty?: undefined;
  rule?: undefined;
  expanded?: undefined;
  onClickAction?: undefined;
} & PaperProps;

export const RuleCard = forwardRef<HTMLDivElement, Props | LoadingProps>(
  (
    { rule, order, multiproperty = false, expanded, onClickAction, loading, ...rest },
    ref
  ) => {
    const theme = useTheme();
    const globalTheme = useGlobalTheme();

    return (
      <Paper
        data-testid={"rule-card"}
        ref={ref}
        elevation={1}
        sx={{ overflow: "hidden" }}
        {...rest}
      >
        <Box display={"flex"} padding={theme.spacing(2)} justifyContent={"space-between"}>
          <Box display={"flex"} alignItems={"center"} width={"100%"}>
            <DragIndicatorRoundedIcon sx={{ color: globalTheme.colors.grey[400] }} />
            {loading ? (
              <Skeleton
                data-testid={"name-skeleton"}
                variant={"rounded"}
                width={"40%"}
                sx={{ maxWidth: "400px" }}
              />
            ) : (
              <Typography fontWeight={600} sx={{ ml: theme.spacing(1) }}>
                {rule.name}
              </Typography>
            )}
          </Box>

          <Box display={"flex"} alignItems={"center"} minWidth={"max-content"}>
            {typeof order === "number" && (
              <PriorityOrderTooltip>
                <span>
                  <Tag
                    data-testid={"rule-order"}
                    label={`Order ${order}`}
                    color={loading ? "default" : "primary"}
                    sx={{ fontWeight: 600 }}
                  />
                </span>
              </PriorityOrderTooltip>
            )}

            <Box m={theme.spacing(0, 1.5, 0, 2.5)}>
              <IconButton
                data-testid={"edit-rule"}
                color={"neutral"}
                onClick={() => !loading && onClickAction("edit", rule)}
                disabled={loading}
              >
                <EditRoundedIcon />
              </IconButton>
              <IconButton
                data-testid={"delete-rule"}
                color={"neutral"}
                onClick={() => !loading && onClickAction("delete", rule)}
                disabled={loading}
              >
                <DeleteRoundedIcon />
              </IconButton>
            </Box>

            <IconButton
              data-testid={"expand-rule"}
              color={"primary"}
              onClick={() => !loading && onClickAction("expand-collapse", rule)}
              disabled={loading}
            >
              <ArrowDropDownCircleRoundedIcon
                sx={{ ...(expanded && { transform: "rotate(180deg)" }) }}
              />
            </IconButton>
          </Box>
        </Box>
        <Collapse unmountOnExit in={expanded}>
          <Box padding={theme.spacing(0, 3, 3, 2)} sx={{ cursor: "default" }}>
            {!loading && (
              <RuleDetail
                triggers={rule.triggers}
                ignoreSuppression={rule.isIgnoreSuppression ?? false}
                assignment={rule.assignment}
                multiproperty={multiproperty}
                siteName={rule.site?.name}
              />
            )}
          </Box>
        </Collapse>
      </Paper>
    );
  }
);

function PriorityOrderTooltip({ children }: { children: ReactElement }) {
  return (
    <Tooltip
      title={
        <>
          <Typography gutterBottom variant={"label"} fontWeight={600} color={"white"}>
            Evaluation Order
          </Typography>
          <Typography variant={"label"} color={"white"}>
            This determines the sequence in which rules are evaluated when a guest cards
            in. To adjust it, simply drag and drop the rules in the list.
          </Typography>
        </>
      }
    >
      {children}
    </Tooltip>
  );
}
