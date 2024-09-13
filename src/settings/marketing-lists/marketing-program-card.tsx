import { ReactElement } from "react";
import { Paper, Tooltip, Typography } from "@vizexplorer/global-ui-v2";
import { gql } from "@apollo/client";
import {
  Box,
  Collapse,
  Divider,
  PaperProps,
  Skeleton,
  styled,
  useTheme
} from "@mui/material";
import ArrowDropDownCircleRoundedIcon from "@mui/icons-material/ArrowDropDownCircleRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { MarketingProgramCardProgramFragment } from "./__generated__/marketing-program-card";
import { PdMarketingProgramStatus } from "generated-graphql";
import { IconButton } from "view-v2/icon-button";
import { DuplicateIcon } from "view-v2/icons";
import { MarketingProgramStatusTag } from "./marketing-program-status-tag";
import { MarketingProgramActionType } from "./types";
import {
  isActiveMarketingProgramStatus,
  isHistoricalMarketingProgramStatus
} from "./utils";
import { MarketingProgramDetail } from "./marketing-program-detail";

const SummaryContainer = styled("div")(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2, 3),
  justifyContent: "space-between",
  alignItems: "center",
  columnGap: theme.spacing(2)
}));

type Props = {
  loading?: false;
  program: MarketingProgramCardProgramFragment;
  expanded: boolean;
  onClickAction: (
    actionType: MarketingProgramActionType,
    program: MarketingProgramCardProgramFragment
  ) => void;
} & PaperProps;

type LoadingProps = {
  loading: true;
  program?: MarketingProgramCardProgramFragment;
  expanded?: undefined;
  onClickAction?: undefined;
} & PaperProps;

export function MarketingProgramCard({
  program,
  expanded,
  loading,
  onClickAction,
  ...rest
}: Props | LoadingProps) {
  const theme = useTheme();

  return (
    <Paper
      data-testid={"marketing-program-card"}
      elevation={1}
      sx={{ overflow: "hidden" }}
      {...rest}
    >
      {loading ? (
        <LoadingMarketingProgramCard />
      ) : (
        <>
          <SummaryContainer>
            <Typography fontWeight={600}>{program.name}</Typography>

            <Box display={"flex"} alignItems={"center"} columnGap={theme.spacing(2)}>
              {isActiveMarketingProgramStatus(program.status) && (
                <MarketingProgramStatusTag status={program.status} />
              )}

              <Box display={"flex"}>
                <MarketingActionIcon
                  data-testid={"duplicate-marketing-program"}
                  tooltip={"Duplicate"}
                  icon={<DuplicateIcon />}
                  onClick={() => onClickAction("duplicate", program)}
                />
                {isActiveMarketingProgramStatus(program.status) && (
                  <>
                    <MarketingActionIcon
                      data-testid={"edit-marketing-program"}
                      tooltip={"Edit"}
                      icon={<EditRoundedIcon />}
                      onClick={() => onClickAction("edit", program)}
                    />

                    {program.status === PdMarketingProgramStatus.Current && (
                      <MarketingActionIcon
                        data-testid={"stop-marketing-program"}
                        tooltip={
                          "Click to stop future actions; completed actions will be saved for reporting."
                        }
                        icon={<BlockRoundedIcon />}
                        onClick={() => onClickAction("stop", program)}
                      />
                    )}

                    {program.status === PdMarketingProgramStatus.Future && (
                      <MarketingActionIcon
                        data-testid={"delete-marketing-program"}
                        tooltip={"Delete"}
                        icon={<DeleteRoundedIcon />}
                        onClick={() => onClickAction("delete", program)}
                      />
                    )}
                  </>
                )}

                {isHistoricalMarketingProgramStatus(program.status) && (
                  <MarketingActionIcon
                    data-testid={"remove-marketing-program"}
                    tooltip={
                      "Click to remove from this view; data will be retained for reports."
                    }
                    icon={<CloseRoundedIcon />}
                    onClick={() => onClickAction("remove", program)}
                  />
                )}
              </Box>

              <IconButton
                data-testid={"expand-marketing-program"}
                color={"primary"}
                onClick={() => onClickAction("expand-collapse", program)}
              >
                <ArrowDropDownCircleRoundedIcon
                  sx={{ ...(expanded && { transform: "rotate(180deg)" }) }}
                />
              </IconButton>
            </Box>
          </SummaryContainer>
          <Collapse unmountOnExit in={expanded}>
            <Box>
              <Divider />
              <MarketingProgramDetail programDetail={program} />
            </Box>
          </Collapse>
        </>
      )}
    </Paper>
  );
}

type MarketingActionIconProps = {
  disabled?: boolean;
  tooltip: string;
  icon: ReactElement;
  onClick: VoidFunction;
};

function MarketingActionIcon({
  tooltip,
  icon,
  onClick,
  disabled,
  ...rest
}: MarketingActionIconProps) {
  return (
    <Tooltip title={tooltip}>
      <span>
        <IconButton disabled={disabled} color={"neutral"} onClick={onClick} {...rest}>
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
}

function LoadingMarketingProgramCard() {
  return (
    <SummaryContainer data-testid={"loading-card"}>
      <Skeleton variant={"rounded"} width={"40%"} sx={{ maxWidth: "300px" }} />
      <Box display={"flex"} alignItems={"center"}>
        <Skeleton variant={"rounded"} width={"40%"} sx={{ minWidth: "300px" }} />
        <IconButton disabled>
          <ArrowDropDownCircleRoundedIcon />
        </IconButton>
      </Box>
    </SummaryContainer>
  );
}

MarketingProgramCard.fragments = {
  marketingProgramCardProgram: gql`
    fragment MarketingProgramCardProgram on PdMarketingProgram {
      id
      name
      status
      ...MarketingProgramCardProgramDetail
    }
    ${MarketingProgramDetail.fragments.marketingProgramDetail}
  `
};
