import { useEffect, useMemo, useState } from "react";
import { RuleActionType } from "./types";
import { Box, styled } from "@mui/material";
import { Button } from "@vizexplorer/global-ui-v2";
import { RuleCard } from "./rule-card";
import { Search } from "../../common";
import { NoSearchResult } from "./no-search-results";
import { NoRules } from "./no-rules";
import {
  GreetRuleFragment,
  useGetSitesQuery,
  useGreetRulesPriorityUpdateMutation,
  useGreetRuleDeleteMutation,
  useCurrentUserQuery,
  useGreetRulesLazyQuery
} from "generated-graphql";
import {
  GreetRuleDialog,
  DeleteRuleDialog,
  convertGreetRuleToDraft,
  emptyGreetRuleDraft
} from "./dialog";
import { ruleMatchesSearch, sitesManageableByUser } from "./utils";
import { GreetRulesList } from "./greet-rules-list";
import { NoSiteSelection, SomethingWentWrong } from "view-v2/page";
import { sortArray } from "../../../view/utils";
import { GreetRuleDraft } from "./reducer/types";
import { SiteSelectSiteFragment, SiteSelect } from "view-v2/site-select";

const GreetRulesContainer = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0, 0, 2.5, 0)
}));

const ToolbarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2.5)
}));

const NoSearchResultContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  width: "100%",
  marginTop: theme.spacing(4)
}));

const StyledRuleCard = styled(RuleCard)(({ theme }) => ({
  marginTop: theme.spacing(2)
}));

type ManageRule = {
  type: "add" | "edit";
  rule: GreetRuleDraft;
};

export function GreetRules() {
  const [search, setSearch] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);
  const [rules, setRules] = useState<GreetRuleFragment[]>([]);
  const [manageRule, setManageRule] = useState<ManageRule | null>(null);
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);
  const [deleteRule, setDeleteRule] = useState<GreetRuleFragment | null>(null);
  const [selectedSite, setSelectedSite] = useState<SiteSelectSiteFragment | null>(null);

  const [
    loadRules,
    { data: rulesData, loading: rulesLoading, called: rulesCalled, refetch: refetchRules }
  ] = useGreetRulesLazyQuery({ fetchPolicy: "cache-and-network", onError: setError });
  const {
    data: sitesData,
    loading: sitesLoading,
    refetch: refetchSites
  } = useGetSitesQuery({ fetchPolicy: "cache-and-network", onError: setError });
  const {
    data: curUserData,
    loading: curUserLoading,
    refetch: refetchCurUser
  } = useCurrentUserQuery({ onError: setError });

  const [updateRulesPriority, { loading: priorityUpdating }] =
    useGreetRulesPriorityUpdateMutation();
  const [runDeleteRule, { loading: deletingRule }] = useGreetRuleDeleteMutation({
    onError: setError
  });

  const renderRules = useMemo(() => {
    return search ? rules.filter((rule) => ruleMatchesSearch(rule, search)) : rules;
  }, [rules, search]);
  const sites = useMemo(() => {
    if (!sitesData?.sites || !curUserData?.currentUser) return [];
    const allowedSites = sitesManageableByUser(sitesData.sites, curUserData.currentUser);
    return sortArray(allowedSites || [], true, (site) => site.name);
  }, [sitesData, curUserData]);
  const loading =
    rulesLoading ||
    sitesLoading ||
    curUserLoading ||
    (sites.length === 1 && !rulesCalled);

  useEffect(() => {
    // wait for `priorityUpdating` to prevent flickering when updating priorities in quick succession
    if (!rulesData?.pdGreetRules || priorityUpdating) return;
    setRules([...rulesData.pdGreetRules].sort((a, b) => a.priority - b.priority));
  }, [rulesData, priorityUpdating]);

  useEffect(() => {
    if (sites.length !== 1) return;
    handleSiteChange(sites[0]);
  }, [sites]);

  function handleRulesReorder(newList: GreetRuleFragment[], siteId: string) {
    const origCopy = [...rules];
    setRules(newList);
    updateRulesPriority({
      variables: { ruleIds: newList.map((rule) => rule.id), siteId },
      onError: () => setRules(origCopy)
    });
  }

  function handleRuleActionClick(type: RuleActionType, rule: GreetRuleFragment) {
    switch (type) {
      case "edit":
        setManageRule({
          type: "edit",
          rule: convertGreetRuleToDraft(rule)
        });
        break;
      case "expand-collapse":
        setExpandedRuleId((cur) => {
          if (cur === rule.id) return null;
          return rule.id;
        });
        break;
      case "delete":
        setDeleteRule(rule);
        break;
    }
  }

  async function handleDeleteRule(rule: GreetRuleFragment) {
    await runDeleteRule({ variables: { id: rule.id, siteId: rule.site!.id } });
    refetchRules();
    setRules((cur) => cur.filter((r) => r.id !== rule.id));
    setDeleteRule(null);
  }

  function handleSiteChange(site: SiteSelectSiteFragment) {
    loadRules({ variables: { siteId: site.id } });
    setSearch("");
    setSelectedSite(site);
  }

  if (error) {
    return (
      <SomethingWentWrong
        data-testid={"greet-rules-error"}
        onClickRefresh={() => {
          setError(null);
          refetchCurUser();
          refetchRules();
          refetchSites();
        }}
      />
    );
  }

  function handleClickAddRule() {
    setManageRule({ type: "add", rule: emptyGreetRuleDraft(selectedSite!.id) });
  }

  return (
    <>
      {manageRule && (
        <GreetRuleDialog
          draftRule={manageRule.rule}
          onClose={() => setManageRule(null)}
          actionType={manageRule.type}
          onSaveComplete={() => {
            refetchRules();
            setManageRule(null);
          }}
        />
      )}
      {!!deleteRule && (
        <DeleteRuleDialog
          ruleName={deleteRule.name}
          disabled={deletingRule}
          onDelete={() => handleDeleteRule(deleteRule)}
          onClose={() => setDeleteRule(null)}
        />
      )}
      <GreetRulesContainer data-testid={"greet-rules"}>
        {(selectedSite || !loading) && sites.length > 1 && (
          <SiteSelect selected={selectedSite} sites={sites} onChange={handleSiteChange} />
        )}

        {(loading || (!!selectedSite && !!rulesData?.pdGreetRules.length)) && (
          <ToolbarContainer>
            <Search
              data-testid={"greet-rule-search"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClickClose={() => setSearch("")}
              placeholder={"Search"}
              disabled={loading}
              sx={{ width: "250px" }}
            />
            <Button
              data-testid={"add-rule-btn"}
              disabled={loading}
              onClick={handleClickAddRule}
              variant={"contained"}
              size={"small"}
            >
              Add rule
            </Button>
          </ToolbarContainer>
        )}

        {search && !renderRules.length ? (
          <NoSearchResultContainer>
            <NoSearchResult search={search} onClickClearSearch={() => setSearch("")} />
          </NoSearchResultContainer>
        ) : loading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <StyledRuleCard
              data-testid={"greet-rule-loading"}
              key={`loading-rule-${idx}`}
              loading
              order={idx + 1}
            />
          ))
        ) : !selectedSite ? (
          <NoSiteSelection requiredFor={"rules"} />
        ) : !rulesData?.pdGreetRules.length ? (
          <NoRules onClickAddNewRule={handleClickAddRule} />
        ) : (
          <GreetRulesList
            allRules={rules}
            renderRules={renderRules}
            selectedSite={selectedSite}
            isMultiProperty={sites.length > 1}
            expandedRuleId={expandedRuleId}
            onReorder={handleRulesReorder}
            handleRuleActionClick={handleRuleActionClick}
          />
        )}
      </GreetRulesContainer>
    </>
  );
}
