import { Paper, Tooltip } from "@vizexplorer/global-ui-v2";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ArrowDropDownCircleRoundedIcon from "@mui/icons-material/ArrowDropDownCircleRounded";
import { ProgramActionType } from "./types";
import {
  Box,
  Collapse,
  Divider,
  PaperProps,
  Skeleton,
  styled,
  useTheme
} from "@mui/material";
import { IconButton } from "view-v2/icon-button";
import { isActiveProgramStatus } from "./utils";
import { gql } from "@apollo/client";
import { DuplicateIcon } from "view-v2/icons";
import { ProgramDetail } from "./program-detail";
import { ProgramStatusTag } from "./program-status-tag";
import { ProgramCardProgramFragment } from "./__generated__/program-card";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { Link } from "view-v2/link";

const SummaryContainer = styled("div")(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2, 3),
  justifyContent: "space-between",
  alignItems: "center",
  columnGap: theme.spacing(2)
}));

type Props = {
  loading?: false;
  program: ProgramCardProgramFragment;
  expanded: boolean;
  onClickAction: (
    actionType: ProgramActionType,
    program: ProgramCardProgramFragment
  ) => void;
} & PaperProps;

type LoadingProps = {
  loading: true;
  program?: ProgramCardProgramFragment;
  expanded?: undefined;
  onClickAction?: undefined;
} & PaperProps;

export function ProgramCard({
  program,
  expanded,
  loading,
  onClickAction,
  ...rest
}: Props | LoadingProps) {
  const theme = useTheme();

  return (
    <Paper
      data-testid={"program-card"}
      elevation={1}
      sx={{ overflow: "hidden" }}
      {...rest}
    >
      <SummaryContainer>
        {loading ? (
          <Skeleton
            data-testid={"name-skeleton"}
            variant={"rounded"}
            width={"40%"}
            sx={{ maxWidth: "400px" }}
          />
        ) : (
          <ProgramTitle
            title={program.name}
            onLinkClick={() => !loading && onClickAction("name", program)}
          />
        )}

        <Box display={"flex"} alignItems={"center"} columnGap={theme.spacing(2)}>
          {!loading && isActiveProgramStatus(program.status) && (
            <ProgramStatusTag status={program.status} />
          )}

          <Box display={"flex"}>
            {(loading || isActiveProgramStatus(program.status)) && (
              <>
                <IconButton
                  data-testid={"edit-program"}
                  color={"neutral"}
                  onClick={() => !loading && onClickAction("edit", program)}
                  disabled={loading}
                >
                  <EditRoundedIcon />
                </IconButton>
                <IconButton
                  data-testid={"delete-program"}
                  color={"neutral"}
                  onClick={() => !loading && onClickAction("delete", program)}
                  disabled={loading}
                >
                  <DeleteRoundedIcon />
                </IconButton>
              </>
            )}
            <IconButton
              data-testid={"duplicate-program"}
              color={"neutral"}
              onClick={() => !loading && onClickAction("duplicate", program)}
              disabled={loading}
            >
              <DuplicateIcon />
            </IconButton>
          </Box>

          <IconButton
            disabled={loading}
            data-testid={"expand-program"}
            color={"primary"}
            onClick={() => !loading && onClickAction("expand-collapse", program)}
          >
            <ArrowDropDownCircleRoundedIcon
              sx={{ ...(expanded && { transform: "rotate(180deg)" }) }}
            />
          </IconButton>
        </Box>
      </SummaryContainer>
      <Collapse unmountOnExit in={expanded}>
        {!loading && (
          <Box>
            <Divider />
            <ProgramDetail programDetail={program} />
          </Box>
        )}
      </Collapse>
    </Paper>
  );
}

type TitleProps = {
  title: string;
  onLinkClick: VoidFunction;
};

function ProgramTitle({ title, onLinkClick }: TitleProps) {
  return (
    <Box display={"flex"} overflow={"hidden"}>
      <Tooltip followCursor title={title} enterDelay={500} enterNextDelay={500}>
        <Link
          data-testid={"program-name"}
          component={"button"}
          variant={"large"}
          onClick={onLinkClick}
          noWrap
        >
          {title}
          <OpenInNewRoundedIcon sx={{ ml: "4px", fontSize: "16px" }} />
        </Link>
      </Tooltip>
    </Box>
  );
}

ProgramCard.fragments = {
  programCardProgram: gql`
    fragment ProgramCardProgram on PdGoalProgram {
      id
      name
      status
      ...ProgramCardProgramDetail
    }
    ${ProgramDetail.fragments.programDetail}
  `
};
