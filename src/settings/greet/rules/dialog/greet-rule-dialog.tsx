import { Box, styled, useTheme } from "@mui/material";
import { RuleSettings } from "./rule-settings";
import {
  Button,
  Dialog,
  DialogHeader,
  Typography,
  useGlobalTheme
} from "@vizexplorer/global-ui-v2";
import {
  useCurrentUserQuery,
  useGreetRuleCreateMutation,
  usePdGreetRuleUpdateMutation,
  useGreetRuleBuilderOrgDataQuery,
  useGreetRuleBuilderSiteDataLazyQuery,
  useGetSitesQuery
} from "generated-graphql";
import { useEffect, useMemo } from "react";
import { TriggerSettings } from "./trigger-settings";
import { greetRuleReducer, isNameTaken, isRuleComplete } from "../reducer";
import { useImmerReducer } from "use-immer";
import { GreetRuleDraft, ReducerState } from "../reducer/types";
import { sitesManageableByUser } from "../utils";
import { sortArray } from "../../../../view/utils";
import { AssignmentSettings } from "./assignment-settings";
import { draftRuleToRuleCreateInput, draftRuleToUpdateInput } from "./utils";
import { useAlert } from "view-v2/alert";

const ActionsContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "160px 160px",
  columnGap: theme.spacing(4),
  alignSelf: "end"
}));

type Props = {
  draftRule: GreetRuleDraft;
  onClose: VoidFunction;
  onSaveComplete: VoidFunction;
  actionType: "add" | "edit";
};

export function GreetRuleDialog({
  draftRule,
  onClose,
  onSaveComplete,
  actionType
}: Props) {
  const theme = useTheme();
  const globalTheme = useGlobalTheme();
  const initialState: ReducerState = { rule: draftRule, error: null, ruleChanged: false };
  const [state, dispatch] = useImmerReducer(greetRuleReducer, initialState);
  const { addAlert } = useAlert();

  const { data: curUserData, loading: curUserLoading } = useCurrentUserQuery();
  // load sites seperate from builder data so we can retrieve from cache to quickly determine if the property select should be displayed
  const { data: sitesData, loading: sitesLoading } = useGetSitesQuery();
  const { data: orgData, loading: orgDataLoading } = useGreetRuleBuilderOrgDataQuery();
  const [
    loadSiteData,
    { data: siteData, called: siteDataCalled, loading: siteDataLoading }
  ] = useGreetRuleBuilderSiteDataLazyQuery();

  const [createRule, { loading: creatingRule }] = useGreetRuleCreateMutation({
    onCompleted: ({ pdGreetRuleCreate }) => {
      addAlert({ message: `${pdGreetRuleCreate.name} added`, severity: "success" });
      onSaveComplete();
    },
    onError: () => {
      addAlert({
        message: "An unexpected error occurred while saving. Please try again.",
        severity: "error"
      });
    }
  });
  const [editRule, { loading: editingRule }] = usePdGreetRuleUpdateMutation({
    onCompleted: ({ pdGreetRuleUpdate }) => {
      if (!pdGreetRuleUpdate) return;
      addAlert({ message: `${pdGreetRuleUpdate.name} updated`, severity: "success" });
      onSaveComplete();
    },
    onError: () => {
      addAlert({
        message: "An unexpected error occurred while saving. Please try again.",
        severity: "error"
      });
    }
  });

  const sites = useMemo(() => {
    if (!curUserData?.currentUser || !sitesData?.sites) return [];
    const allowedSites = sitesManageableByUser(sitesData.sites, curUserData.currentUser);
    return sortArray(allowedSites || [], true, (site) => site.name);
  }, [sitesData, curUserData]);

  const isRuleValid = useMemo(() => {
    if (!siteData?.pdGreetRules) return false;
    return isRuleComplete(state.rule, siteData?.pdGreetRules, draftRule.name);
  }, [state.rule, siteData?.pdGreetRules]);

  useEffect(() => {
    if (!state.rule.siteId) return;
    loadSiteData({ variables: { siteId: state.rule.siteId } });
  }, [state.rule.siteId]);

  function handleClickSave() {
    actionType === "add"
      ? createRule({ variables: { input: draftRuleToRuleCreateInput(state.rule) } })
      : editRule({
          variables: { input: draftRuleToUpdateInput(state.rule) }
        });
  }

  const tiers = orgData?.pdOrgSettings?.tiers ?? [];
  const sections = siteData?.pdGreetSections ?? [];
  const userGroups = orgData?.pdUserGroups ?? [];

  const loadingSections = siteDataLoading || (sites.length === 1 && !siteDataCalled);
  const loading = curUserLoading || sitesLoading || orgDataLoading || siteDataLoading;

  return (
    <>
      {loading && <span data-testid={"loading"} style={{ display: "none" }} />}
      <Dialog
        open
        data-testid={"greet-rule-dialog"}
        data-loading={loading}
        PaperProps={{ sx: { maxWidth: "940px", width: "100%" } }}
      >
        <Box display={"flex"} flexDirection={"column"} overflow={"auto"}>
          <DialogHeader
            inlineTitle
            title={actionType === "add" ? "Create a new rule" : "Edit the rule"}
            onClickClose={onClose}
            disableClose={creatingRule || editingRule}
            p={theme.spacing(3)}
          />
          <Box display={"flex"} flexDirection={"column"} p={theme.spacing(0, 3, 3, 3)}>
            <Box mb={2}>
              <Typography
                variant={"bodySmall"}
                color={globalTheme.colors.grey[400]}
                mb={2}
              >
                RULE SETTINGS
              </Typography>
              <RuleSettings
                state={state}
                sites={sites.map((site) => ({ label: site.name, value: site.id }))}
                sectionOptions={sections.map(({ section }) => section)}
                sectionsLoading={loadingSections}
                dispatch={dispatch}
                isNameTaken={isNameTaken(
                  draftRule.name,
                  state.rule.name,
                  siteData?.pdGreetRules ?? []
                )}
                disableFields={creatingRule || editingRule}
              />
            </Box>

            <Box mb={4}>
              <Typography
                variant={"bodySmall"}
                color={globalTheme.colors.grey[400]}
                mb={2}
              >
                TRIGGER SETTINGS
              </Typography>
              <TriggerSettings
                state={state}
                tierOptions={tiers.map((tier) => ({ label: tier.name, value: tier.id }))}
                metrics={orgData?.pdGreetMetrics || []}
                dispatch={dispatch}
                isMultiProperty={sites.length > 1}
                disableFields={creatingRule || editingRule}
              />
            </Box>

            <Box>
              <Typography
                variant={"bodySmall"}
                color={globalTheme.colors.grey[400]}
                mb={2}
              >
                ASSIGNMENT SETTINGS
              </Typography>
              <AssignmentSettings
                state={state}
                dispatch={dispatch}
                isMultiProperty={sites.length > 1}
                userGroups={userGroups.map((userGroup) => ({
                  label: userGroup.name,
                  value: userGroup.id,
                  guestInteraction: userGroup.guestInteractionType
                }))}
                disableFields={creatingRule || editingRule}
              />
            </Box>

            <ActionsContainer mt={theme.spacing(4)}>
              <Button
                disabled={creatingRule || editingRule}
                variant="outlined"
                color={"neutral"}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                disabled={
                  !isRuleValid ||
                  creatingRule ||
                  editingRule ||
                  loading ||
                  !state.ruleChanged
                }
                variant="contained"
                color="primary"
                onClick={handleClickSave}
              >
                Save
              </Button>
            </ActionsContainer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
