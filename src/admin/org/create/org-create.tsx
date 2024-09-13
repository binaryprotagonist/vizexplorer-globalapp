import { Dialog, DialogTitle, Step, StepLabel, Stepper } from "@vizexplorer/global-ui-v2";
import { OrgCreateForm } from "./org-create-form";
import { Box, useTheme } from "@mui/material";
import { gql } from "@apollo/client";
import {
  useSubscriptionCreateV2Mutation,
  useOrgCreateMutation,
  useOrgsQuery,
  useSubscriptionPlansQuery
} from "./__generated__/org-create";
import { NewOrg, OrgCreateFormInput } from "./types";
import { Suspense, useMemo, useState } from "react";
import { ORG_CREATION_STEPS, orgCreateFormToOrgCreateInput } from "./utils";
import { useAlert } from "view-v2/alert";
import { OrgCreateSuccessDialog } from "./org-create-success-dialog";
import { AddSubscriptionForm } from "./add-subscription-form";
import {
  isCompletedReducerState,
  reducerStateAsSubscriptionCreateInput,
  ReducerState,
  initialAddSubscriptionReducerState
} from "view-v2/subscription/add-subscription";

export type Props = {
  // step and newOrg are for testing purposes only, to be able to skip the org creation form
  step?: number;
  newOrg?: NewOrg | null;
  onOrgCreated?: (orgId: string, orgName: string) => void;
  onClickAccess?: (orgId: string, orgName: string) => void;
  onClose?: VoidFunction;
};

export function OrgCreate({
  step = 0,
  newOrg = null,
  onOrgCreated,
  onClickAccess,
  onClose
}: Props) {
  const [formStep, setFormStep] = useState<number>(step);
  const [createdOrg, setCreatedOrg] = useState<NewOrg | null>(newOrg);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const theme = useTheme();
  const { addAlert } = useAlert();

  const { data: orgsData, loading: orgsLoading, error: orgsErr } = useOrgsQuery();
  const {
    data: subPlansData,
    loading: subPlansLoading,
    error: subPlansErr
  } = useSubscriptionPlansQuery();

  const [createOrg, { loading: creatingOrg }] = useOrgCreateMutation({
    onCompleted: (data) => {
      if (!data.orgCreate?.company) return;
      const { id, company } = data.orgCreate;
      onOrgCreated?.(id, company.name);
      setCreatedOrg({ id, name: company.name });
      setFormStep(1);
    },
    onError: (e) => {
      addAlert({ severity: "error", message: e.message });
    }
  });

  const [createSubs, { loading: creatingSubs }] = useSubscriptionCreateV2Mutation({
    onCompleted: (data) => {
      if (!data.subscriptionCreateV2) return;
      setShowSuccessModal(true);
    },
    onError: (e) => {
      addAlert({ severity: "error", message: e.message });
    }
  });

  const subscriptionPlans = subPlansData?.subscriptionPlans ?? [];
  const takenOrgNames = useMemo<Set<string>>(() => {
    if (!orgsData) return new Set();
    return new Set(orgsData.orgs.map((org) => org.company?.name?.toLowerCase() ?? ""));
  }, [orgsData]);

  function handleSaveOrg(form: OrgCreateFormInput) {
    createOrg({ variables: { input: orgCreateFormToOrgCreateInput(form) } });
  }

  function handleSaveSubscription(form: ReducerState) {
    if (!createdOrg || !isCompletedReducerState(form)) return;

    const subscriptions = reducerStateAsSubscriptionCreateInput(form, subscriptionPlans);
    createSubs({ variables: { orgId: createdOrg.id, subscriptions } });
  }

  function handleSkipAddSubscriptions() {
    setShowSuccessModal(true);
  }

  if (showSuccessModal && createdOrg) {
    return (
      <OrgCreateSuccessDialog
        id={createdOrg.id}
        name={createdOrg.name}
        onClickAccess={onClickAccess}
        onClose={onClose}
      />
    );
  }

  if (orgsErr) throw orgsErr;
  if (subPlansErr) throw subPlansErr;

  return (
    <Dialog
      data-testid={"org-create"}
      open
      disableRestoreFocus
      PaperProps={{ sx: { width: "100%", maxWidth: "820px" } }}
    >
      <DialogTitle p={theme.spacing(4, 4, 2, 4)} gridArea={"title"}>
        Add a new organization
      </DialogTitle>

      <Box m={theme.spacing(2, 4, 2, 3)} maxWidth={"432px"}>
        <Stepper activeStep={formStep}>
          {ORG_CREATION_STEPS.map(({ label, Icon }) => (
            <Step key={label}>
              <StepLabel icon={<Icon />}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {formStep === 0 && (
        <Suspense fallback={<span data-testid={"org-create-form-loading"} />}>
          <OrgCreateForm
            takenOrgNames={takenOrgNames}
            loading={orgsLoading}
            saving={creatingOrg}
            onSubmit={handleSaveOrg}
            onCancel={onClose}
          />
        </Suspense>
      )}

      {formStep === 1 && (
        <AddSubscriptionForm
          initialFormState={initialAddSubscriptionReducerState()}
          subscriptionPlans={subscriptionPlans}
          loading={subPlansLoading}
          saving={creatingSubs}
          onSkip={handleSkipAddSubscriptions}
          onSubmit={handleSaveSubscription}
        />
      )}
    </Dialog>
  );
}

const _ORGS_QUERY = gql`
  query Orgs {
    orgs {
      id
      company {
        id
        name
      }
    }
  }
`;

const _SUBSCRIPTION_PLANS_QUERY = gql`
  query SubscriptionPlans {
    subscriptionPlans {
      ...SubBuilderSubPlan
    }
  }
  ${AddSubscriptionForm.fragments.subBuilderSubPlan}
`;

const _ORG_CREATE_MUTATION = gql`
  mutation OrgCreate($input: OrgCreateInput!) {
    orgCreate(input: $input) {
      id
      company {
        id
        name
      }
    }
  }
`;

const _SUBS_CREATE_MUTATION = gql`
  mutation subscriptionCreateV2(
    $orgId: ID!
    $subscriptions: [SubscriptionCreateInput!]!
  ) {
    subscriptionCreateV2(orgId: $orgId, subscriptions: $subscriptions) {
      id
    }
  }
`;
