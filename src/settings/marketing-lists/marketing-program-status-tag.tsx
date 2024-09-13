import { Tooltip } from "@vizexplorer/global-ui-v2";
import { PdMarketingProgramStatus } from "generated-graphql";
import { Tag } from "view-v2/tag";

type Props = {
  status: PdMarketingProgramStatus;
};

export function MarketingProgramStatusTag({ status }: Props) {
  return (
    <Tooltip title={statusTooltip(status)}>
      <span>
        <Tag
          data-testid={"marketing-program-status"}
          label={statusLabel(status)}
          color={statusColor(status)}
          sx={{ cursor: "default" }}
        />
      </span>
    </Tooltip>
  );
}

function statusColor(status: PdMarketingProgramStatus) {
  switch (status) {
    case PdMarketingProgramStatus.Current:
      return "success";
    case PdMarketingProgramStatus.Future:
      return "warning";
    default:
      return "default";
  }
}

function statusLabel(status: PdMarketingProgramStatus) {
  switch (status) {
    case PdMarketingProgramStatus.Current:
      return "Current";
    case PdMarketingProgramStatus.Future:
      return "Future";
  }
}

function statusTooltip(status: PdMarketingProgramStatus) {
  switch (status) {
    case PdMarketingProgramStatus.Current:
      return "Active actions currently underway";
    case PdMarketingProgramStatus.Future:
      return "Actions scheduled to start at a later date";
    default:
      return "";
  }
}
