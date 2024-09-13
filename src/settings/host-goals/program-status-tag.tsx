import { Tooltip } from "@vizexplorer/global-ui-v2";
import { Tag } from "view-v2/tag";
import { PdGoalProgramStatus } from "generated-graphql";

type Props = {
  status: PdGoalProgramStatus;
};

export function ProgramStatusTag({ status }: Props) {
  return (
    <Tooltip title={statusTooltip(status)}>
      <span>
        <Tag
          data-testid={"program-status"}
          label={statusLabel(status)}
          color={statusColor(status)}
          sx={{ cursor: "default" }}
        />
      </span>
    </Tooltip>
  );
}

function statusColor(status: PdGoalProgramStatus) {
  switch (status) {
    case PdGoalProgramStatus.Current:
      return "success";
    case PdGoalProgramStatus.Future:
      return "warning";
    default:
      return "default";
  }
}

function statusLabel(status: PdGoalProgramStatus) {
  switch (status) {
    case PdGoalProgramStatus.Current:
      return "Current";
    case PdGoalProgramStatus.Future:
      return "Future";
  }
}

function statusTooltip(status: PdGoalProgramStatus) {
  switch (status) {
    case PdGoalProgramStatus.Current:
      return "Active programs currently underway";
    case PdGoalProgramStatus.Future:
      return "Programs scheduled to start at a later date";
    default:
      return "";
  }
}
