export enum UserActionTypePd {
  EDIT_RULE
}

type EditRuleActionPd = {
  type: UserActionTypePd.EDIT_RULE;
  siteId: string;
};

export type UserActionPd = EditRuleActionPd;
