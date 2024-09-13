import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd";
import { Box, styled } from "@mui/material";
import { RuleActionType } from "./types";
import { useMemo } from "react";
import { GreetRuleFragment } from "generated-graphql";
import { RuleCard } from "./rule-card";
import { useGlobalTheme } from "@vizexplorer/global-ui-v2";
import { SiteSelectSiteFragment } from "view-v2/site-select";

const StyledRuleCard = styled(RuleCard)(({ theme }) => ({
  marginTop: theme.spacing(2)
}));

type Props = {
  allRules: GreetRuleFragment[];
  // to retain correct reorder behavior during search, we need to keep a separate list of filtered rules from all rules
  renderRules: GreetRuleFragment[];
  selectedSite: SiteSelectSiteFragment;
  isMultiProperty?: boolean;
  expandedRuleId?: string | null;
  onReorder: (rules: GreetRuleFragment[], siteId: string) => void;
  handleRuleActionClick: (actionType: RuleActionType, rule: GreetRuleFragment) => void;
};

export function GreetRulesList({
  allRules,
  renderRules,
  expandedRuleId,
  selectedSite,
  isMultiProperty = false,
  onReorder,
  handleRuleActionClick
}: Props) {
  const theme = useGlobalTheme();

  const { enabledRules, disabledRules } = useMemo(() => {
    return {
      enabledRules: renderRules.filter((r) => r.isEnabled),
      disabledRules: renderRules.filter((r) => !r.isEnabled)
    };
  }, [renderRules]);

  function onDragEnd(result: DropResult) {
    const srcIdx = result.source.index;
    const destIdx = result.destination?.index ?? null;
    if (destIdx === null || destIdx === srcIdx) return;

    const idxs = trueRuleIndexes(allRules, enabledRules, srcIdx, destIdx);
    if (!idxs) return;

    const newRulesList = reorderRules(allRules, idxs.srcIdx, idxs.destIdx);
    if (!newRulesList) return;

    onReorder(newRulesList, selectedSite.id);
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={"single-column"}>
          {(provided) => (
            <Box
              data-testid={"greet-rules-list"}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {enabledRules.map((rule, idx) => (
                <Draggable key={rule.id} draggableId={rule.id} index={idx}>
                  {(provided) => (
                    <StyledRuleCard
                      data-testid={"greet-rule"}
                      rule={rule}
                      order={rule.isEnabled ? rule.priority : null}
                      multiproperty={isMultiProperty}
                      expanded={expandedRuleId === rule.id}
                      onClickAction={handleRuleActionClick}
                      loading={false}
                      sx={{
                        cursor: "grab"
                      }}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      {disabledRules.map((rule) => (
        <StyledRuleCard
          key={rule.id}
          data-testid={"greet-rule"}
          rule={rule}
          multiproperty={isMultiProperty}
          expanded={expandedRuleId === rule.id}
          onClickAction={handleRuleActionClick}
          loading={false}
          sx={{
            bgcolor: theme.colors.grey[50]
          }}
        />
      ))}
    </>
  );
}

// indexes are based on render position, which for a filtered list differs from the original array position. Identify indexes in the original list
function trueRuleIndexes(
  originalRules: GreetRuleFragment[],
  renderedRules: GreetRuleFragment[],
  sourceIdx: number,
  destIdx: number
) {
  const sourceRule = renderedRules[sourceIdx];
  const destRule = renderedRules[destIdx];
  const trueSourceIdx = originalRules.findIndex((rule) => rule.id === sourceRule?.id);
  const trueDestIdx = originalRules.findIndex((rule) => rule.id === destRule?.id);
  if (trueSourceIdx === -1 || trueDestIdx === -1) {
    return null;
  }

  return { srcIdx: trueSourceIdx, destIdx: trueDestIdx };
}

function reorderRules(
  rules: GreetRuleFragment[],
  sourceIdx: number,
  destIdx: number
): GreetRuleFragment[] | null {
  const newRulesList = [...rules];
  const [removed] = newRulesList.splice(sourceIdx, 1);
  newRulesList.splice(destIdx, 0, removed);
  return newRulesList;
}
