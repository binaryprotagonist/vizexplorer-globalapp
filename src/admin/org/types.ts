export type AccessOrgDetails = { orgId: string; orgName: string };

type NewOrgAction = {
  type: "new";
};

type AccessOrgAction = {
  type: "access";
  value: AccessOrgDetails;
};

export type ActionEvt = NewOrgAction | AccessOrgAction;
