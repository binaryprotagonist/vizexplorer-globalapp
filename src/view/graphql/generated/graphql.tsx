import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  CssColor: { input: any; output: any };
  CurrencyCode: { input: any; output: any };
  DateTime: { input: any; output: any };
  Decimal: { input: any; output: any };
  JSON: { input: any; output: any };
  JSONObject: { input: any; output: any };
  NaiveDate: { input: any; output: any };
  OdrJaqlValue: { input: any; output: any };
  PdGreetRuleConditionValue: {
    input: string | (string | null)[] | number | (number | null)[];
    output: string | (string | null)[] | number | (number | null)[];
  };
  TimeZone: { input: any; output: any };
  UUID: { input: any; output: any };
};

export enum AccessLevel {
  /** The user don't have access at the Org level, but can be assigned roles at each application. */
  AppSpecific = "APP_SPECIFIC",
  /** The user cannot have access at any level. */
  NoAccess = "NO_ACCESS",
  OrgAdmin = "ORG_ADMIN"
}

export enum Action {
  Cancel = "CANCEL",
  Upgrade = "UPGRADE"
}

export type Address = {
  __typename?: "Address";
  city: Scalars["String"]["output"];
  country: Scalars["String"]["output"];
  phone: Scalars["String"]["output"];
  postalCode: Scalars["String"]["output"];
  region: Scalars["String"]["output"];
  street1: Scalars["String"]["output"];
  street2: Scalars["String"]["output"];
};

export type AppAccessInput = {
  appId: Scalars["String"]["input"];
  roleId: Scalars["String"]["input"];
  siteId?: InputMaybe<Scalars["Int"]["input"]>;
  siteIdV2?: InputMaybe<Scalars["ID"]["input"]>;
};

/** App Id. */
export enum AppId {
  Floorheatmap = "floorheatmap",
  Mar = "mar",
  Pdengage = "pdengage",
  Pdereporting = "pdereporting",
  Pdr = "pdr",
  Pdre = "pdre",
  Pdrer = "pdrer",
  Ratedguestdashboards = "ratedguestdashboards",
  Ratedguestheatmap = "ratedguestheatmap",
  Sras = "sras",
  Sre = "sre",
  Vizbi = "vizbi"
}

export type AppRole = {
  __typename?: "AppRole";
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
};

export type AppSubscription = {
  __typename?: "AppSubscription";
  id: Scalars["ID"]["output"];
  isOnprem?: Maybe<Scalars["Boolean"]["output"]>;
  isValid?: Maybe<Scalars["Boolean"]["output"]>;
  maxSlots: Scalars["Int"]["output"];
  package?: Maybe<Scalars["String"]["output"]>;
  periodEndDate?: Maybe<Scalars["DateTime"]["output"]>;
  periodStartDate?: Maybe<Scalars["DateTime"]["output"]>;
  /**
   * The upper range of the slot limits tier.
   *
   * May not always be available, depending on whether the
   * subscription includes a tiered add on.
   */
  slotsTierUpperRange?: Maybe<Scalars["Int"]["output"]>;
  status?: Maybe<SubscriptionStatus>;
};

export type Application = {
  __typename?: "Application";
  /**
   * The current user's access list in the app.
   *
   * `app_id` could be passed when the app is a bundle of multiple apps.
   */
  accessList?: Maybe<Array<UserAppAccess>>;
  dataSourceEnabled: Scalars["Boolean"]["output"];
  /** @deprecated Use `name` instead */
  fullName: Scalars["String"]["output"];
  /** Whether the current user has access to this app. */
  hasAccess: Scalars["Boolean"]["output"];
  icon: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  /** The roles that the application supports */
  roles: Array<AppRole>;
  /** The sites that are accessible to the application. */
  sites: Array<Site>;
  status: Status;
  subscription?: Maybe<AppSubscription>;
  url: Scalars["String"]["output"];
};

export type ApplicationAccessListArgs = {
  appId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type ApplicationSubscription = {
  __typename?: "ApplicationSubscription";
  application?: Maybe<Application>;
  dataAdapter: Scalars["Boolean"]["output"];
  id: Scalars["String"]["output"];
  inFirstPeriod: Scalars["Boolean"]["output"];
  inTrial: Scalars["Boolean"]["output"];
  payment: Payment;
  periodEndDate: Scalars["DateTime"]["output"];
  periodStartDate: Scalars["DateTime"]["output"];
  plan: PlanBrief;
  slots: SlotAddon;
  status: Status;
  subtotal: Scalars["Float"]["output"];
};

export enum BillingInterval {
  Annual = "ANNUAL",
  Monthly = "MONTHLY"
}

export type CommunicationSettings = {
  __typename?: "CommunicationSettings";
  allowsCalling?: Maybe<Scalars["Boolean"]["output"]>;
  allowsEmailing?: Maybe<Scalars["Boolean"]["output"]>;
  allowsTexting?: Maybe<Scalars["Boolean"]["output"]>;
};

export type Company = {
  __typename?: "Company";
  address: Address;
  /** @deprecated No longer supported */
  config: Config;
  email: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  subscription?: Maybe<ApplicationSubscription>;
};

export type CompanyInput = {
  city: Scalars["String"]["input"];
  country: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
  postalCode: Scalars["String"]["input"];
  region: Scalars["String"]["input"];
  street1: Scalars["String"]["input"];
  street2: Scalars["String"]["input"];
};

export type Config = {
  __typename?: "Config";
  maxSlots: Scalars["Int"]["output"];
  multiProperties: Scalars["Boolean"]["output"];
};

export type Currency = {
  __typename?: "Currency";
  /** The currency code */
  code?: Maybe<Scalars["CurrencyCode"]["output"]>;
};

export type DataAdapter = {
  __typename?: "DataAdapter";
  id: Scalars["ID"]["output"];
  stageDb?: Maybe<DataAdapterStageDb>;
};

/** Data adapter stage db. */
export type DataAdapterStageDb = {
  __typename?: "DataAdapterStageDb";
  databaseName: Scalars["String"]["output"];
  host: Scalars["String"]["output"];
  password: Scalars["String"]["output"];
  port: Scalars["Int"]["output"];
  username: Scalars["String"]["output"];
};

/** Data feed status. */
export type DataFeedStatus = {
  __typename?: "DataFeedStatus";
  /** Inclusive max date. */
  maxDate?: Maybe<Scalars["NaiveDate"]["output"]>;
  sourceSiteIds: Array<Scalars["ID"]["output"]>;
};

export type Discovery = {
  __typename?: "Discovery";
  auth?: Maybe<Keycloak>;
  env?: Maybe<Env>;
};

export type DiscoveryAuthArgs = {
  applicationId?: InputMaybe<Scalars["String"]["input"]>;
};

export type Env = {
  __typename?: "Env";
  /** Is this an on-prem installation */
  onPrem?: Maybe<Scalars["Boolean"]["output"]>;
  /** Number of days before the version end of life. */
  remainingDays?: Maybe<Scalars["Int"]["output"]>;
  /** Cloud endpoint for checking updates */
  updateChecker?: Maybe<Scalars["String"]["output"]>;
  versions?: Maybe<Versions>;
};

export type FeedSiteMapping = {
  __typename?: "FeedSiteMapping";
  id: Scalars["ID"]["output"];
  sourceSiteId?: Maybe<Scalars["ID"]["output"]>;
};

export type FeedSiteMappingUpdateInput = {
  siteId: Scalars["ID"]["input"];
  sourceSiteId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type GroupAssignmentCreateInput = {
  assignmentToType: PdGreetAssignmentType;
  userGroupId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type GuestAttribute = {
  __typename?: "GuestAttribute";
  kind: GuestAttributeKind;
  value?: Maybe<GuestAttributeValue>;
};

export enum GuestAttributeKind {
  AssignedHost = "ASSIGNED_HOST",
  Birthday = "BIRTHDAY",
  Email = "EMAIL",
  LastCommunication = "LAST_COMMUNICATION",
  LastTrip = "LAST_TRIP",
  Phone = "PHONE",
  Tier = "TIER"
}

export type GuestAttributeValue =
  | PdBirthday
  | PdEmail
  | PdGuestLastContact
  | PdHost
  | PdLastTrip
  | PdPhone
  | PdTier;

export enum GuestEventType {
  CardIn = "CARD_IN",
  CardOut = "CARD_OUT"
}

export type HeatMap = {
  __typename?: "HeatMap";
  /** Derived attributes from the file name in the S3 key. */
  attributes?: Maybe<Scalars["JSONObject"]["output"]>;
  id: Scalars["ID"]["output"];
  uploadedAt: Scalars["DateTime"]["output"];
};

export type Keycloak = {
  __typename?: "Keycloak";
  authServerUrl: Scalars["String"]["output"];
  clientId?: Maybe<Scalars["String"]["output"]>;
  realm: Scalars["String"]["output"];
};

export type License = {
  __typename?: "License";
  required: Scalars["Boolean"]["output"];
  status?: Maybe<LicenseStatus>;
};

export type LicenseCreateInput = {
  expiresAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  /**
   * Keep existing licenses.
   *
   * By default, existing licenses will be disabled.
   */
  keepExistingLicenses: Scalars["Boolean"]["input"];
};

export type LicenseDisableInput = {
  id: Scalars["ID"]["input"];
};

export type LicenseEnableInput = {
  id: Scalars["ID"]["input"];
};

export type LicenseError = {
  __typename?: "LicenseError";
  code: Scalars["String"]["output"];
  message: Scalars["String"]["output"];
};

export type LicenseStatus = {
  __typename?: "LicenseStatus";
  error?: Maybe<LicenseError>;
  isValid: Scalars["Boolean"]["output"];
};

export type LicenseUpdateInput = {
  expiresAt: Scalars["DateTime"]["input"];
  id: Scalars["ID"]["input"];
};

export type LicenseVerification = {
  __typename?: "LicenseVerification";
  app?: Maybe<Scalars["String"]["output"]>;
  sisense?: Maybe<Scalars["String"]["output"]>;
  sisenseDataObject?: Maybe<Scalars["String"]["output"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  companyUpdate?: Maybe<Company>;
  /**
   * Temporary api for sending web push notification to a user.
   *
   * The `payload` could be any valid json value.
   */
  dangerWebPushSend: Scalars["Boolean"]["output"];
  /** Disable data adapter for an Org. */
  dataAdapterDisable?: Maybe<DataAdapter>;
  /** Enable data adapter for current org. */
  dataAdapterEnable?: Maybe<DataAdapter>;
  /** Update data feed site mapping */
  feedSiteMappingUpdate?: Maybe<FeedSiteMapping>;
  licenseUpdate?: Maybe<LicenseStatus>;
  nativeSiteMappingUpdate?: Maybe<NativeSiteMapping>;
  /**
   * Create a no access user
   * @deprecated Use `userCreateV2` instead.
   */
  noAccessUserCreate?: Maybe<User>;
  odrDashboardReset?: Maybe<OdrDashboard>;
  odrDashboardsExport: OdrJob;
  odrDataConnectorCreate?: Maybe<OdrDataConnector>;
  odrDataConnectorUpdate?: Maybe<OdrDataConnector>;
  odrDataSourceUpdate?: Maybe<OdrDataSource>;
  odrJobCancel: Scalars["Boolean"]["output"];
  /**
   * Create a new org.
   *
   * Error extensions code:
   *
   * * `COMPANY_NAME_EXISTS`: the company name already exists.
   * * `USER_EMAIL_EXISTS`: the user email already exists.
   */
  orgCreate?: Maybe<Org>;
  orgDataAdapterDelete?: Maybe<Scalars["Boolean"]["output"]>;
  orgDataSourcesDelete: Scalars["Boolean"]["output"];
  orgDelete?: Maybe<Org>;
  orgFeaturesUpdate: OrgFeatures;
  orgHeatmapAdd?: Maybe<OrgHeatMap>;
  orgHeatmapDelete?: Maybe<Scalars["Boolean"]["output"]>;
  orgLicenseCreate?: Maybe<OrgLicense>;
  orgLicenseDisable?: Maybe<OrgLicense>;
  orgLicenseEnable?: Maybe<OrgLicense>;
  orgLicenseUpdate?: Maybe<OrgLicense>;
  /** Remove all sites from an Org. */
  orgSitesDelete?: Maybe<Scalars["Boolean"]["output"]>;
  /** Remove all users and sites from an Org. */
  orgUsersDelete?: Maybe<Scalars["Boolean"]["output"]>;
  pdGoalProgramCreate?: Maybe<PdGoalProgram>;
  pdGoalProgramDelete?: Maybe<Scalars["Boolean"]["output"]>;
  pdGoalProgramUpdate?: Maybe<PdGoalProgram>;
  /** Create rule. */
  pdGreetRuleCreate: PdGreetRule;
  /** Delete a Greet rule. */
  pdGreetRuleDelete?: Maybe<Scalars["Boolean"]["output"]>;
  /** Update rule. */
  pdGreetRuleUpdate?: Maybe<PdGreetRule>;
  /** Update the priority of the Greet rules where priority is the sequence of the ordered greet rule ids */
  pdGreetRulesPriorityUpdate: Array<PdGreetRule>;
  /** Update pd greet settings. */
  pdGreetSettingsUpdate?: Maybe<PdGreetSettings>;
  /** Update a greet status */
  pdGreetStatusUpdate?: Maybe<PdGreet>;
  pdGuestCommunicate?: Maybe<PdGuestCommunication>;
  pdHostGreeterStatusUpdate?: Maybe<PdGreeterStatus>;
  /**
   * Update host mappings for a user.
   *
   * This will make sure user is mapped to the provided native host ids in the input.
   *
   * If the user was mapped to a native host id not specified in the input, it will be removed.
   */
  pdHostMappingUpdate?: Maybe<Array<PdHostMapping>>;
  pdLayoutUpdate?: Maybe<PdLayout>;
  pdLayoutV2Update?: Maybe<PdLayoutV2>;
  pdMarketingProgramDelete?: Maybe<Scalars["Boolean"]["output"]>;
  /** Update pd org settings. */
  pdOrgSettingsUpdate?: Maybe<PdOrgSettings>;
  /** Update rule config. i.e. Weight, Enabled */
  pdRuleConfigUpdate: PdRuleConfig;
  /** Complete a task */
  pdTaskComplete?: Maybe<PdTask>;
  /** Dismiss a task */
  pdTaskDismiss?: Maybe<PdTask>;
  /** Snooze a task */
  pdTaskSnooze?: Maybe<PdTask>;
  /**
   * Run the recommendation engine to generate new tasks.
   *
   * VizAdmin permission is required.
   */
  pdTasksEngineRun?: Maybe<Array<PdTask>>;
  pdUserGroupCreate?: Maybe<PdUserGroup>;
  pdUserGroupDelete?: Maybe<Scalars["Boolean"]["output"]>;
  pdUserGroupUpdate?: Maybe<PdUserGroup>;
  /** Create a property */
  siteCreateV2?: Maybe<Site>;
  /** Delete a property */
  siteDelete?: Maybe<Scalars["Boolean"]["output"]>;
  /** Update a property */
  siteUpdate?: Maybe<Site>;
  /** Create a subscription for org. */
  subscriptionCreate?: Maybe<AppSubscription>;
  /** Create subscriptions for org. */
  subscriptionCreateV2: Array<AppSubscription>;
  /**
   * Terminate a subscription.
   *
   * The subscription will be terminated immediately.
   */
  subscriptionTerminate?: Maybe<AppSubscription>;
  /** Update a existing subscription. */
  subscriptionUpdate?: Maybe<AppSubscription>;
  /** @deprecated Use `sudoImpersonateOrgV2` instead */
  sudoImpersonateOrg?: Maybe<Scalars["ID"]["output"]>;
  sudoImpersonateOrgV2?: Maybe<Scalars["ID"]["output"]>;
  /** @deprecated Use `sudoImpersonateUserV3` instead */
  sudoImpersonateUserV2?: Maybe<Scalars["String"]["output"]>;
  sudoImpersonateUserV3?: Maybe<Scalars["String"]["output"]>;
  /**
   * Update a user's access level and app access list
   * @deprecated Use `userUpdate` instead.
   */
  userAccessUpdate?: Maybe<User>;
  /**
   * Grant a new app access to user
   * @deprecated Use `userUpdate` instead.
   */
  userAppAccessGrant?: Maybe<UserAppAccess>;
  /**
   * Revoke an app access from a user
   * @deprecated Use `userUpdate` instead.
   */
  userAppAccessRevoke?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Create a user
   * @deprecated Use `userCreateV2` instead.
   */
  userCreate?: Maybe<User>;
  /** Create a user (unified version) */
  userCreateV2?: Maybe<User>;
  /** Delete a user */
  userDelete?: Maybe<Scalars["Boolean"]["output"]>;
  /** Reset user password */
  userPasswordReset?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * Update user profile
   * @deprecated Use `userUpdate` instead.
   */
  userProfileUpdate?: Maybe<User>;
  /** Update user profile */
  userUpdate?: Maybe<User>;
  webPushDeregister: Scalars["Boolean"]["output"];
  webPushRegister: Scalars["Boolean"]["output"];
};

export type MutationCompanyUpdateArgs = {
  input: CompanyInput;
};

export type MutationDangerWebPushSendArgs = {
  payload: Scalars["JSON"]["input"];
  userId: Scalars["String"]["input"];
};

export type MutationDataAdapterDisableArgs = {
  orgId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type MutationDataAdapterEnableArgs = {
  orgId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type MutationFeedSiteMappingUpdateArgs = {
  input: FeedSiteMappingUpdateInput;
};

export type MutationLicenseUpdateArgs = {
  key: Scalars["String"]["input"];
};

export type MutationNativeSiteMappingUpdateArgs = {
  input: NativeSiteMappingUpdateInput;
};

export type MutationNoAccessUserCreateArgs = {
  user: NoAccessUserInput;
};

export type MutationOdrDashboardResetArgs = {
  id: Scalars["ID"]["input"];
  input?: InputMaybe<OdrDashboardResetInput>;
};

export type MutationOdrDashboardsExportArgs = {
  currencySetting?: InputMaybe<OdrDashboardCurrencySettingInput>;
  dashboardIds: Array<Scalars["String"]["input"]>;
  exportType?: InputMaybe<OdrExportType>;
  filters?: InputMaybe<Scalars["String"]["input"]>;
  siteId?: InputMaybe<Scalars["Int"]["input"]>;
};

export type MutationOdrDataConnectorCreateArgs = {
  input: OdrDataConnectorCreateInput;
};

export type MutationOdrDataConnectorUpdateArgs = {
  input: OdrDataConnectorUpdateInput;
};

export type MutationOdrDataSourceUpdateArgs = {
  input: OdrDataSourceUpdateInput;
};

export type MutationOdrJobCancelArgs = {
  jobId: Scalars["ID"]["input"];
};

export type MutationOrgCreateArgs = {
  input: OrgCreateInput;
};

export type MutationOrgDataAdapterDeleteArgs = {
  orgId: Scalars["ID"]["input"];
};

export type MutationOrgDataSourcesDeleteArgs = {
  orgId: Scalars["ID"]["input"];
};

export type MutationOrgDeleteArgs = {
  orgId: Scalars["ID"]["input"];
};

export type MutationOrgFeaturesUpdateArgs = {
  input: OrgFeaturesUpdateInput;
};

export type MutationOrgHeatmapAddArgs = {
  input: OrgHeatMapCreateInput;
};

export type MutationOrgHeatmapDeleteArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationOrgLicenseCreateArgs = {
  input?: InputMaybe<LicenseCreateInput>;
};

export type MutationOrgLicenseDisableArgs = {
  input: LicenseDisableInput;
};

export type MutationOrgLicenseEnableArgs = {
  input: LicenseEnableInput;
};

export type MutationOrgLicenseUpdateArgs = {
  input: LicenseUpdateInput;
};

export type MutationOrgSitesDeleteArgs = {
  orgId: Scalars["ID"]["input"];
};

export type MutationOrgUsersDeleteArgs = {
  orgId: Scalars["ID"]["input"];
};

export type MutationPdGoalProgramCreateArgs = {
  input: PdGoalProgramCreateInput;
};

export type MutationPdGoalProgramDeleteArgs = {
  input: PdGoalProgramDeleteInput;
};

export type MutationPdGoalProgramUpdateArgs = {
  input: PdGoalProgramUpdateInput;
};

export type MutationPdGreetRuleCreateArgs = {
  input: PdGreetRuleCreateInput;
};

export type MutationPdGreetRuleDeleteArgs = {
  id: Scalars["ID"]["input"];
  siteId: Scalars["ID"]["input"];
};

export type MutationPdGreetRuleUpdateArgs = {
  input: PdGreetRuleUpdateInput;
};

export type MutationPdGreetRulesPriorityUpdateArgs = {
  ruleIds: Array<Scalars["ID"]["input"]>;
  siteId: Scalars["ID"]["input"];
};

export type MutationPdGreetSettingsUpdateArgs = {
  input: PdGreetSettingsUpdateInput;
};

export type MutationPdGreetStatusUpdateArgs = {
  input: PdGreetStatusUpdateInput;
};

export type MutationPdGuestCommunicateArgs = {
  input: PdCommunicationInput;
};

export type MutationPdHostGreeterStatusUpdateArgs = {
  input: PdGreeterStatusUpdateInput;
};

export type MutationPdHostMappingUpdateArgs = {
  input: PdHostMappingUpdateInput;
};

export type MutationPdLayoutUpdateArgs = {
  input: PdLayoutUpdateInput;
};

export type MutationPdLayoutV2UpdateArgs = {
  input: PdLayoutV2Input;
};

export type MutationPdMarketingProgramDeleteArgs = {
  input: PdMarketingProgramDeleteInput;
};

export type MutationPdOrgSettingsUpdateArgs = {
  input: PdOrgSettingsInput;
};

export type MutationPdRuleConfigUpdateArgs = {
  input: PdRuleConfigUpdateInput;
};

export type MutationPdTaskCompleteArgs = {
  input: PdTaskCompleteInput;
};

export type MutationPdTaskDismissArgs = {
  input: PdTaskDismissInput;
};

export type MutationPdTaskSnoozeArgs = {
  input: PdTaskSnoozeInput;
};

export type MutationPdTasksEngineRunArgs = {
  input: PdTaskEngineInput;
};

export type MutationPdUserGroupCreateArgs = {
  input: PdUserGroupCreateInput;
};

export type MutationPdUserGroupDeleteArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationPdUserGroupUpdateArgs = {
  input: PdUserGroupUpdateInput;
};

export type MutationSiteCreateV2Args = {
  input: SiteCreateInput;
};

export type MutationSiteDeleteArgs = {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  idV2?: InputMaybe<Scalars["ID"]["input"]>;
};

export type MutationSiteUpdateArgs = {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  idV2?: InputMaybe<Scalars["ID"]["input"]>;
  site: SiteUpdate;
};

export type MutationSubscriptionCreateArgs = {
  input: SubscriptionCreateInput;
};

export type MutationSubscriptionCreateV2Args = {
  orgId?: InputMaybe<Scalars["ID"]["input"]>;
  subscriptions: Array<SubscriptionCreateInput>;
};

export type MutationSubscriptionTerminateArgs = {
  input: SubscriptionTerminateInput;
};

export type MutationSubscriptionUpdateArgs = {
  input: SubscriptionUpdateInput;
};

export type MutationSudoImpersonateOrgArgs = {
  orgId: Scalars["ID"]["input"];
};

export type MutationSudoImpersonateOrgV2Args = {
  orgId: Scalars["ID"]["input"];
  reason: Scalars["String"]["input"];
};

export type MutationSudoImpersonateUserV2Args = {
  redirectUrl: Scalars["String"]["input"];
  userId: Scalars["String"]["input"];
};

export type MutationSudoImpersonateUserV3Args = {
  reason: Scalars["String"]["input"];
  redirectUrl: Scalars["String"]["input"];
  userId: Scalars["String"]["input"];
};

export type MutationUserAccessUpdateArgs = {
  input: UserAccessInput;
};

export type MutationUserAppAccessGrantArgs = {
  input: UserAppAccessGrantInput;
};

export type MutationUserAppAccessRevokeArgs = {
  input: UserAppAccessRevokeInput;
};

export type MutationUserCreateArgs = {
  user: NewUserInput;
};

export type MutationUserCreateV2Args = {
  user: NewUserInputV2;
};

export type MutationUserDeleteArgs = {
  id: Scalars["String"]["input"];
};

export type MutationUserPasswordResetArgs = {
  user: UserPasswordResetInput;
};

export type MutationUserProfileUpdateArgs = {
  user: UserProfileInput;
};

export type MutationUserUpdateArgs = {
  user: UserProfileInput;
};

export type MutationWebPushRegisterArgs = {
  input: WebPushRegistrationInput;
};

export type NativeSiteMapping = {
  __typename?: "NativeSiteMapping";
  id: Scalars["ID"]["output"];
  nativeSiteId: Scalars["ID"]["output"];
  slotMaxDate?: Maybe<Scalars["NaiveDate"]["output"]>;
};

export type NativeSiteMappingUpdateInput = {
  nativeSiteId: Scalars["String"]["input"];
  siteId: Scalars["ID"]["input"];
};

export type NewUserInput = {
  accessLevel: OrgAccessLevel;
  email: Scalars["String"]["input"];
  firstName: Scalars["String"]["input"];
  lastName: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
};

export type NewUserInputV2 = {
  accessLevel: OrgAccessLevel;
  accessList?: InputMaybe<Array<UserAppAccessGrantInputV2>>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  firstName: Scalars["String"]["input"];
  lastName: Scalars["String"]["input"];
  password?: InputMaybe<Scalars["String"]["input"]>;
  phone?: InputMaybe<Scalars["String"]["input"]>;
};

export type NoAccessUserInput = {
  email?: InputMaybe<Scalars["String"]["input"]>;
  firstName: Scalars["String"]["input"];
  lastName: Scalars["String"]["input"];
  phone?: InputMaybe<Scalars["String"]["input"]>;
};

export type OdrBuildJob = {
  __typename?: "OdrBuildJob";
  accumulationId: Scalars["ID"]["output"];
  appId: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  site?: Maybe<Site>;
  status: OdrBuildJobStatus;
};

export type OdrBuildJobStatus = {
  __typename?: "OdrBuildJobStatus";
  error?: Maybe<Scalars["String"]["output"]>;
  finished: Scalars["Boolean"]["output"];
};

export type OdrDashboard = {
  __typename?: "OdrDashboard";
  dateRange?: Maybe<OdrDashboardDateRange>;
  filters: Array<OdrSimpleFilter>;
  filtersBySite: Array<OdrSiteFilter>;
  id: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  widgets: Array<OdrWidget>;
};

export type OdrDashboardDateRangeArgs = {
  siteId: Scalars["ID"]["input"];
};

export type OdrDashboardFiltersBySiteArgs = {
  siteId: Scalars["Int"]["input"];
};

export type OdrDashboardBrief = {
  __typename?: "OdrDashboardBrief";
  id: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
};

export type OdrDashboardCurrencySettingInput = {
  symbol?: InputMaybe<Scalars["String"]["input"]>;
};

export type OdrDashboardDateRange = {
  __typename?: "OdrDashboardDateRange";
  max?: Maybe<Scalars["NaiveDate"]["output"]>;
  min?: Maybe<Scalars["NaiveDate"]["output"]>;
};

export type OdrDashboardFolder = {
  __typename?: "OdrDashboardFolder";
  /** Application ID. */
  appId: Scalars["String"]["output"];
  dashboards: Array<OdrDashboardBrief>;
  /** Whether dynamic elasticube is supported. */
  dynamicElasticube?: Maybe<Scalars["Boolean"]["output"]>;
  id: Scalars["ID"]["output"];
  /** Dashboard folder name. */
  name: Scalars["String"]["output"];
  slotLatestBuild?: Maybe<OdrSlotLatestBuild>;
};

export type OdrDashboardResetInput = {
  currency?: InputMaybe<OdrDashboardCurrencySettingInput>;
};

export type OdrDataConnector = {
  __typename?: "OdrDataConnector";
  dataRefreshTime?: Maybe<OdrDataRefreshTime>;
  hostVizSiteIds?: Maybe<Array<Scalars["ID"]["output"]>>;
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  params?: Maybe<OdrDataConnectorParams>;
};

export type OdrDataConnectorCreateInput = {
  dataRefreshTime: OdrDataRefreshTimeInput;
  database: Scalars["String"]["input"];
  hostname: Scalars["String"]["input"];
  kind: OdrDataConnectorKind;
  name: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  port: Scalars["Int"]["input"];
  tlsEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  username: Scalars["String"]["input"];
};

export enum OdrDataConnectorKind {
  Mssql = "MSSQL"
}

export type OdrDataConnectorParams = OdrMssqlParams;

export type OdrDataConnectorUpdateInput = {
  dataRefreshTime: OdrDataRefreshTimeInput;
  database: Scalars["String"]["input"];
  hostname: Scalars["String"]["input"];
  id: Scalars["ID"]["input"];
  kind: OdrDataConnectorKind;
  name: Scalars["String"]["input"];
  password?: InputMaybe<Scalars["String"]["input"]>;
  port: Scalars["Int"]["input"];
  tlsEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  username: Scalars["String"]["input"];
};

export type OdrDataRefreshTime = {
  __typename?: "OdrDataRefreshTime";
  hour: Scalars["Int"]["output"];
  minute: Scalars["Int"]["output"];
  timezone: Scalars["String"]["output"];
};

export type OdrDataRefreshTimeInput = {
  hour: Scalars["Int"]["input"];
  minute: Scalars["Int"]["input"];
  timezone: Scalars["String"]["input"];
};

export type OdrDataSource = {
  __typename?: "OdrDataSource";
  app?: Maybe<Application>;
  connector?: Maybe<OdrDataConnector>;
  connectorParams?: Maybe<OdrDataSourceParams>;
  id?: Maybe<Scalars["ID"]["output"]>;
  site?: Maybe<Site>;
};

export enum OdrDataSourceKind {
  HostViz = "HOST_VIZ"
}

export type OdrDataSourceParams = OdrHostVizParams;

export type OdrDataSourceUpdateInput = {
  appId: Scalars["ID"]["input"];
  connectorId: Scalars["ID"]["input"];
  hostVizSiteId: Scalars["ID"]["input"];
  kind: OdrDataSourceKind;
  siteId: Scalars["ID"]["input"];
};

/**
 * DataType in of the Sisense JAQL values.
 * We are using lowercase for the variants to make it consistent with Sisense
 */
export enum OdrDataType {
  Datetime = "datetime",
  Numeric = "numeric",
  Text = "text"
}

/**
 * Date Level for the datetime dimension.
 * We are using lowercase for the variants to make it consistent with Sisense
 */
export enum OdrDateLevel {
  Days = "days",
  Hours = "hours",
  Minutes = "minutes",
  Months = "months",
  Quarters = "quarters",
  Timestamp = "timestamp",
  Years = "years"
}

export type OdrExportJob = {
  __typename?: "OdrExportJob";
  appId: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  oneTimeLink: Scalars["String"]["output"];
  status: OdrExportStatus;
};

export type OdrExportStatus = {
  __typename?: "OdrExportStatus";
  canceled: Scalars["Boolean"]["output"];
  error?: Maybe<Scalars["String"]["output"]>;
  finished: Scalars["Boolean"]["output"];
  progress: Scalars["Float"]["output"];
};

export enum OdrExportType {
  Excel = "EXCEL",
  Pdf = "PDF",
  PdfAndExcel = "PDF_AND_EXCEL"
}

export type OdrFilterOptions = {
  __typename?: "OdrFilterOptions";
  hasMore: Scalars["Boolean"]["output"];
  options: Array<Scalars["OdrJaqlValue"]["output"]>;
};

export enum OdrFilterVariant {
  ActiveGameDate = "ACTIVE_GAME_DATE",
  DateRange = "DATE_RANGE",
  MnumHistory = "MNUM_HISTORY",
  MultiSelect = "MULTI_SELECT",
  NotSupported = "NOT_SUPPORTED",
  SingleSelect = "SINGLE_SELECT",
  ValueRange = "VALUE_RANGE"
}

export type OdrHostVizParams = {
  __typename?: "OdrHostVizParams";
  siteId: Scalars["ID"]["output"];
};

export type OdrJaqlValueConnection = {
  __typename?: "OdrJaqlValueConnection";
  /** A list of edges. */
  edges: Array<OdrJaqlValueEdge>;
  /** A list of nodes. */
  nodes: Array<Scalars["OdrJaqlValue"]["output"]>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type OdrJaqlValueEdge = {
  __typename?: "OdrJaqlValueEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: Scalars["OdrJaqlValue"]["output"];
};

export type OdrJaqlValueType = {
  __typename?: "OdrJaqlValueType";
  dataType: OdrDataType;
  dateLevel?: Maybe<OdrDateLevel>;
};

export type OdrJob = OdrBuildJob | OdrExportJob;

export type OdrMssqlParams = {
  __typename?: "OdrMssqlParams";
  database: Scalars["String"]["output"];
  hostname: Scalars["String"]["output"];
  port: Scalars["Int"]["output"];
  tlsEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  username: Scalars["String"]["output"];
};

export type OdrSimpleFilter = {
  __typename?: "OdrSimpleFilter";
  dim: Scalars["String"]["output"];
  max?: Maybe<Scalars["OdrJaqlValue"]["output"]>;
  min?: Maybe<Scalars["OdrJaqlValue"]["output"]>;
  options: Array<Scalars["OdrJaqlValue"]["output"]>;
  optionsV2: OdrFilterOptions;
  title: Scalars["String"]["output"];
  valueType: OdrJaqlValueType;
  values: Array<Scalars["OdrJaqlValue"]["output"]>;
  variant: OdrFilterVariant;
};

export type OdrSimpleFilterOptionsV2Args = {
  first: Scalars["Int"]["input"];
};

export type OdrSiteFilter = {
  __typename?: "OdrSiteFilter";
  dim: Scalars["String"]["output"];
  max?: Maybe<Scalars["OdrJaqlValue"]["output"]>;
  min?: Maybe<Scalars["OdrJaqlValue"]["output"]>;
  options: Array<Scalars["OdrJaqlValue"]["output"]>;
  optionsV2: OdrFilterOptions;
  title: Scalars["String"]["output"];
  valueType: OdrJaqlValueType;
  variant: OdrFilterVariant;
};

export type OdrSiteFilterOptionsV2Args = {
  first: Scalars["Int"]["input"];
};

export type OdrSlotLatestBuild = OdrSlotLatestBuildCsvUpload | OdrSlotLatestBuildDataFeed;

export type OdrSlotLatestBuildCsvUpload = {
  __typename?: "OdrSlotLatestBuildCsvUpload";
  accumulationId: Scalars["ID"]["output"];
  lastGamingDate?: Maybe<Scalars["NaiveDate"]["output"]>;
  maxDateRange: Scalars["Int"]["output"];
  minDateRange: Scalars["Int"]["output"];
  siteId: Scalars["ID"]["output"];
};

export type OdrSlotLatestBuildDataFeed = {
  __typename?: "OdrSlotLatestBuildDataFeed";
  accumulationId: Scalars["ID"]["output"];
  lastGamingDate?: Maybe<Scalars["NaiveDate"]["output"]>;
  siteId: Scalars["ID"]["output"];
};

export type OdrWidget = {
  __typename?: "OdrWidget";
  /** Widget id. */
  id: Scalars["String"]["output"];
  reference: OdrWidgetReference;
  /** Widget title. */
  title: Scalars["String"]["output"];
  /**
   * Widget type
   *
   * ## Example Values
   *
   * * `indicator`: [Indicator](https://docs.sisense.com/main/SisenseLinux/indicator.htm)
   * * `chart/pie`: [Pie Chart](https://docs.sisense.com/main/SisenseLinux/pie-chart.htm)
   *
   * See [Widget Types](https://developer.sisense.com/display/API2/Widget+Types) for more information.
   */
  type: Scalars["String"]["output"];
};

/** A compound key for a dashboard widget. */
export type OdrWidgetReference = {
  __typename?: "OdrWidgetReference";
  /** App Id */
  appId: Scalars["String"]["output"];
  /** Dashboard title. */
  dashboard?: Maybe<Scalars["String"]["output"]>;
  /** Widget title. */
  widget: Scalars["String"]["output"];
};

export type Org = {
  __typename?: "Org";
  company?: Maybe<Company>;
  dataAdapter?: Maybe<DataAdapter>;
  /** Whether data adapter is allowed for this org. */
  dataAdapterAllowed?: Maybe<Scalars["Boolean"]["output"]>;
  dataAdapterEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  /** The Org's features */
  features: OrgFeatures;
  /** Validates if a property has at least one mapped native site id. */
  hasNativeSiteMappings: Scalars["Boolean"]["output"];
  id: Scalars["ID"]["output"];
  /** List of connected onprem tunnels. */
  onPremTunnels: Array<OrgOnPremTunnel>;
  sites: Array<Site>;
};

/** User's access level at the Org */
export enum OrgAccessLevel {
  /** The user don't have access at the Org level, but can be assigned roles at each application. */
  AppSpecific = "APP_SPECIFIC",
  /** The user cannot have access at any level. */
  NoAccess = "NO_ACCESS",
  /** Org admin, can access everything at the Org level. */
  OrgAdmin = "ORG_ADMIN"
}

export type OrgApp = {
  __typename?: "OrgApp";
  /**
   * The current user's access list in the app.
   *
   * `app_id` could be passed when the app is a bundle of multiple apps.
   */
  accessList?: Maybe<Array<UserAppAccess>>;
  /** @deprecated Use `name` instead */
  fullName: Scalars["String"]["output"];
  /** Whether the current user has access to this app. */
  hasAccess: Scalars["Boolean"]["output"];
  icon: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  isValid: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type OrgAppAccessListArgs = {
  appId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type OrgCreateInput = {
  company: CompanyInput;
  user?: InputMaybe<UserInput>;
};

/** The feature set available to the Org */
export type OrgFeatures = {
  __typename?: "OrgFeatures";
  /** Whether the Org has access to multiple properties */
  multiProperties: Scalars["Boolean"]["output"];
};

export type OrgFeaturesUpdateInput = {
  orgSettings: SettingsUpdateInput;
};

export type OrgHeatMap = {
  __typename?: "OrgHeatMap";
  createdAt: Scalars["DateTime"]["output"];
  effectiveFrom: Scalars["NaiveDate"]["output"];
  floorId: Scalars["ID"]["output"];
  heatMapId?: Maybe<Scalars["ID"]["output"]>;
  id: Scalars["ID"]["output"];
  mapUrl: Scalars["String"]["output"];
  sourceSiteId: Scalars["ID"]["output"];
};

export type OrgHeatMapCreateInput = {
  effectiveFrom: Scalars["NaiveDate"]["input"];
  floorId: Scalars["ID"]["input"];
  heatMapId: Scalars["ID"]["input"];
  /** Overwrite existing heat map on the same effective date. */
  overwrite?: InputMaybe<Scalars["Boolean"]["input"]>;
  sourceSiteId: Scalars["ID"]["input"];
};

export type OrgLicense = {
  __typename?: "OrgLicense";
  expiresAt: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
  issuedAt: Scalars["DateTime"]["output"];
  key: Scalars["String"]["output"];
  lastVerifiedAt?: Maybe<Scalars["DateTime"]["output"]>;
  lastVerifiedVersions?: Maybe<LicenseVerification>;
};

export type OrgOnPremTunnel = {
  __typename?: "OrgOnPremTunnel";
  /** Tunnel url. */
  url?: Maybe<Scalars["String"]["output"]>;
};

/** Information about pagination in a connection */
export type PageInfo = {
  __typename?: "PageInfo";
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars["String"]["output"]>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars["Boolean"]["output"];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars["Boolean"]["output"];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars["String"]["output"]>;
};

export type Payment = {
  __typename?: "Payment";
  pastDue: Scalars["Boolean"]["output"];
  pending: Scalars["Boolean"]["output"];
};

export type PdBirthday = {
  __typename?: "PdBirthday";
  date: Scalars["NaiveDate"]["output"];
};

export type PdCommunicationInput = {
  communicationType: PdTaskContactType;
  note: Scalars["String"]["input"];
  playerId: Scalars["ID"]["input"];
  siteId: Scalars["ID"]["input"];
};

export type PdEmail = {
  __typename?: "PdEmail";
  address: Scalars["String"]["output"];
};

export type PdEvaluationExecutorConfigInput = {
  valueMetric: PdEvaluationValueMetric;
  worthPercentage: Scalars["Int"]["input"];
};

export type PdEvaluationPlayerAttributeInput = {
  birthday?: InputMaybe<Scalars["NaiveDate"]["input"]>;
  lastContact?: InputMaybe<Scalars["DateTime"]["input"]>;
  tier?: InputMaybe<Scalars["String"]["input"]>;
  tierRank?: InputMaybe<Scalars["Int"]["input"]>;
  tierUpgradeDate?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type PdEvaluationPlayerInput = {
  attributes?: InputMaybe<PdEvaluationPlayerAttributeInput>;
  metrics?: InputMaybe<PdEvaluationPlayerMetricInput>;
  trips: Array<PdEvaluationPlayerTripInput>;
};

export type PdEvaluationPlayerMetricInput = {
  totalActualWin: Scalars["Decimal"]["input"];
  totalGamingDays: Scalars["Int"]["input"];
  totalTheoWin: Scalars["Decimal"]["input"];
};

export type PdEvaluationPlayerTripInput = {
  endDate: Scalars["DateTime"]["input"];
  startDate: Scalars["DateTime"]["input"];
  totalActualWin: Scalars["Decimal"]["input"];
  totalTheoWin: Scalars["Decimal"]["input"];
};

export type PdEvaluationResult = {
  __typename?: "PdEvaluationResult";
  score?: Maybe<Scalars["Decimal"]["output"]>;
};

export enum PdEvaluationValueMetric {
  DailyAverageWorth = "DAILY_AVERAGE_WORTH",
  TotalWorth = "TOTAL_WORTH",
  TripAverageWorth = "TRIP_AVERAGE_WORTH"
}

export type PdGoalProgram = {
  __typename?: "PdGoalProgram";
  createdAt: Scalars["DateTime"]["output"];
  endDate: Scalars["NaiveDate"]["output"];
  id: Scalars["ID"]["output"];
  isCurrent: Scalars["Boolean"]["output"];
  isFuture: Scalars["Boolean"]["output"];
  /** List the users that are members of the program. */
  members: Array<User>;
  /** List the metrics for the program. */
  metrics: Array<PdGoalProgramMetric>;
  modifiedAt: Scalars["DateTime"]["output"];
  name: Scalars["String"]["output"];
  /** The associated sisense dashboard for individual performance widgets. */
  sisenseDashboardIndividualPerformance?: Maybe<OdrDashboard>;
  /** The associated sisense dashboard for team performance widgets. */
  sisenseDashboardTeamPerformance?: Maybe<OdrDashboard>;
  /** The associated property. */
  site?: Maybe<Site>;
  startDate: Scalars["NaiveDate"]["output"];
  status?: Maybe<PdGoalProgramStatus>;
  /** List the metric targets */
  targets?: Maybe<PdGoalProgramTargetMatrix>;
};

export type PdGoalProgramCreateInput = {
  endDate: Scalars["NaiveDate"]["input"];
  members: Array<Scalars["UUID"]["input"]>;
  metrics: Array<Scalars["ID"]["input"]>;
  name: Scalars["String"]["input"];
  siteId: Scalars["ID"]["input"];
  startDate: Scalars["NaiveDate"]["input"];
  targetMatrix: Array<Array<Scalars["Float"]["input"]>>;
};

export type PdGoalProgramDeleteInput = {
  id: Scalars["ID"]["input"];
  siteId: Scalars["ID"]["input"];
};

export type PdGoalProgramMetric = {
  __typename?: "PdGoalProgramMetric";
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  /** The associated widget for individual performance. */
  sisenseIndividualWidget?: Maybe<OdrWidget>;
  sisenseTeamWidget?: Maybe<OdrWidget>;
};

export enum PdGoalProgramStatus {
  Current = "CURRENT",
  Future = "FUTURE",
  History = "HISTORY"
}

export type PdGoalProgramTargetMatrix = {
  __typename?: "PdGoalProgramTargetMatrix";
  matrix: Array<Array<Scalars["Float"]["output"]>>;
};

export type PdGoalProgramUpdateInput = {
  endDate: Scalars["NaiveDate"]["input"];
  id: Scalars["ID"]["input"];
  members: Array<Scalars["UUID"]["input"]>;
  metrics: Array<Scalars["ID"]["input"]>;
  name: Scalars["String"]["input"];
  siteId: Scalars["ID"]["input"];
  startDate: Scalars["NaiveDate"]["input"];
  targetMatrix: Array<Array<Scalars["Float"]["input"]>>;
};

export type PdGreet = PdGuestAction & {
  __typename?: "PdGreet";
  assetNumber?: Maybe<Scalars["String"]["output"]>;
  /** Assigned Host */
  assignee?: Maybe<PdHost>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  guest: Player;
  id: Scalars["ID"]["output"];
  /** The reason for the greet. */
  reason?: Maybe<Scalars["String"]["output"]>;
  ruleName?: Maybe<Scalars["String"]["output"]>;
  /** Stand Id of the event that trigger or updated the greet. */
  standId?: Maybe<Scalars["String"]["output"]>;
  status: PdGreetStatus;
};

/** Assignment query definitions */
export enum PdGreetAssignmentType {
  AllUsers = "ALL_USERS",
  GuestHost = "GUEST_HOST",
  GuestHostUserGroup = "GUEST_HOST_USER_GROUP",
  SpecificUserGroup = "SPECIFIC_USER_GROUP"
}

export enum PdGreetHostAction {
  Accept = "ACCEPT",
  Complete = "COMPLETE",
  Decline = "DECLINE",
  NotFound = "NOT_FOUND",
  Suppress = "SUPPRESS"
}

export type PdGreetMetricDefinition = {
  __typename?: "PdGreetMetricDefinition";
  code: Scalars["String"]["output"];
  description: Scalars["String"]["output"];
  label: Scalars["String"]["output"];
  position: Scalars["Int"]["output"];
  valueType: PdGreetMetricValueType;
};

export enum PdGreetMetricValueType {
  Date = "DATE",
  Numeric = "NUMERIC",
  Text = "TEXT"
}

export type PdGreetReportConfig = {
  __typename?: "PdGreetReportConfig";
  emailRecipients: Array<Scalars["String"]["output"]>;
  enabled: Scalars["Boolean"]["output"];
};

export type PdGreetReportConfigInput = {
  emailRecipients: Array<Scalars["String"]["input"]>;
  enabled: Scalars["Boolean"]["input"];
};

export type PdGreetRule = {
  __typename?: "PdGreetRule";
  assignment?: Maybe<PdGreetRuleAssignment>;
  id: Scalars["ID"]["output"];
  isEnabled: Scalars["Boolean"]["output"];
  isIgnoreSuppression?: Maybe<Scalars["Boolean"]["output"]>;
  name: Scalars["String"]["output"];
  priority: Scalars["Int"]["output"];
  site?: Maybe<Site>;
  triggers: Array<PdGreetRuleTrigger>;
};

export type PdGreetRuleAssignment = {
  __typename?: "PdGreetRuleAssignment";
  assignTo?: Maybe<PdGreetRuleGroupAssignment>;
  id: Scalars["ID"]["output"];
  overflowAssignment?: Maybe<PdGreetRuleGroupAssignment>;
  overflowAssignment2?: Maybe<PdGreetRuleGroupAssignment>;
  weight: Scalars["Int"]["output"];
};

/**
 * END Assignment query definitions
 * Assignment creation definitions
 */
export type PdGreetRuleAssignmentInput = {
  assignTo: GroupAssignmentCreateInput;
  overflowAssignment1?: InputMaybe<GroupAssignmentCreateInput>;
  overflowAssignment2?: InputMaybe<GroupAssignmentCreateInput>;
  weight: Scalars["Int"]["input"];
};

export enum PdGreetRuleConditionOperator {
  Equal = "EQUAL",
  GreaterOrEqual = "GREATER_OR_EQUAL",
  In = "IN",
  LessOrEqual = "LESS_OR_EQUAL",
  Range = "RANGE"
}

export type PdGreetRuleCreateInput = {
  assignment: PdGreetRuleAssignmentInput;
  isEnabled: Scalars["Boolean"]["input"];
  isIgnoreSuppression?: InputMaybe<Scalars["Boolean"]["input"]>;
  metricTriggers: Array<PdGreetRuleMetricTriggerInput>;
  name: Scalars["String"]["input"];
  siteId: Scalars["ID"]["input"];
  specialTriggers: Array<PdGreetRuleSpecialTriggerCreateInput>;
};

export type PdGreetRuleGroupAssignment = {
  __typename?: "PdGreetRuleGroupAssignment";
  assignmentToType?: Maybe<PdGreetAssignmentType>;
  userGroup?: Maybe<PdUserGroup>;
};

export type PdGreetRuleMetricTrigger = {
  __typename?: "PdGreetRuleMetricTrigger";
  metric?: Maybe<PdGreetMetricDefinition>;
  operator: PdGreetRuleConditionOperator;
  value: Scalars["PdGreetRuleConditionValue"]["output"];
};

export type PdGreetRuleMetricTriggerInput = {
  code: Scalars["String"]["input"];
  operator: PdGreetRuleConditionOperator;
  value: Scalars["PdGreetRuleConditionValue"]["input"];
};

export type PdGreetRuleSpecialTrigger = {
  __typename?: "PdGreetRuleSpecialTrigger";
  type: PdGreetRuleTriggerType;
  value: PdGreetRuleSpecialTriggerValue;
};

export type PdGreetRuleSpecialTriggerCreateInput = {
  type: PdGreetRuleTriggerType;
  value: Scalars["PdGreetRuleConditionValue"]["input"];
};

export type PdGreetRuleSpecialTriggerValue = {
  __typename?: "PdGreetRuleSpecialTriggerValue";
  includeAll: Scalars["Boolean"]["output"];
  valuesIn?: Maybe<Scalars["PdGreetRuleConditionValue"]["output"]>;
};

export type PdGreetRuleTrigger = PdGreetRuleMetricTrigger | PdGreetRuleSpecialTrigger;

export enum PdGreetRuleTriggerType {
  DaysOfWeeks = "DAYS_OF_WEEKS",
  GuestType = "GUEST_TYPE",
  Section = "SECTION",
  Tier = "TIER"
}

export type PdGreetRuleUpdateInput = {
  assignment: PdGreetRuleAssignmentInput;
  id: Scalars["ID"]["input"];
  isEnabled: Scalars["Boolean"]["input"];
  isIgnoreSuppression?: InputMaybe<Scalars["Boolean"]["input"]>;
  metricTriggers: Array<PdGreetRuleMetricTriggerInput>;
  name: Scalars["String"]["input"];
  siteId: Scalars["ID"]["input"];
  specialTriggers: Array<PdGreetRuleSpecialTriggerCreateInput>;
};

export type PdGreetSection = {
  __typename?: "PdGreetSection";
  floor: Scalars["String"]["output"];
  section: Scalars["String"]["output"];
};

export type PdGreetSectionInput = {
  floor: Scalars["String"]["input"];
  section: Scalars["String"]["input"];
};

export type PdGreetSettings = {
  __typename?: "PdGreetSettings";
  greetAssignByPriorityScore: Scalars["Boolean"]["output"];
  greetQueueInactiveTimeout: PdGreetTimeout;
  greetReassignmentTimeout: PdGreetTimeout;
  greetShowGuestActiveActions: Scalars["Boolean"]["output"];
  greetSuppressionDays: PdGreetSuppressionDays;
  guestReportBanned: PdGreetReportConfig;
  hostAllowSuppression: Scalars["Boolean"]["output"];
  hostEnableSections: Scalars["Boolean"]["output"];
  hostMaxAssignments: Scalars["Int"]["output"];
  hostMaxMissedGreets: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
};

export type PdGreetSettingsUpdateInput = {
  greetAssignByPriorityScore?: InputMaybe<Scalars["Boolean"]["input"]>;
  greetQueueInactiveTimeout?: InputMaybe<PdGreetTimeoutInput>;
  greetReassignmentTimeout?: InputMaybe<PdGreetTimeoutInput>;
  greetShowGuestActiveActions?: InputMaybe<Scalars["Boolean"]["input"]>;
  greetSuppressionDays?: InputMaybe<PdGreetSuppressionDaysInput>;
  guestReportBanned?: InputMaybe<PdGreetReportConfigInput>;
  hostAllowSuppression?: InputMaybe<Scalars["Boolean"]["input"]>;
  hostEnableSections?: InputMaybe<Scalars["Boolean"]["input"]>;
  hostMaxAssignments?: InputMaybe<Scalars["Int"]["input"]>;
  hostMaxMissedGreets?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * Greet Status for UI.
 *
 * Some status from legacy GreetViz are not handled.
 *
 * * TimedOut
 *
 * never used in GreetViz.
 *
 * * Expired
 *
 * never used in GreetViz.
 */
export enum PdGreetStatus {
  Assigned = "ASSIGNED",
  Cancelled = "CANCELLED",
  CardOut = "CARD_OUT",
  Completed = "COMPLETED",
  /** Suppress */
  Ignored = "IGNORED",
  InProgress = "IN_PROGRESS",
  New = "NEW",
  NotFound = "NOT_FOUND",
  Rejected = "REJECTED"
}

export type PdGreetStatusUpdateInput = {
  greetId: Scalars["ID"]["input"];
  hostAction: PdGreetHostAction;
  note?: InputMaybe<Scalars["String"]["input"]>;
  siteId: Scalars["ID"]["input"];
};

export type PdGreetSuppressionDays = {
  __typename?: "PdGreetSuppressionDays";
  coded: Scalars["Int"]["output"];
  uncoded: Scalars["Int"]["output"];
};

export type PdGreetSuppressionDaysInput = {
  coded: Scalars["Int"]["input"];
  uncoded: Scalars["Int"]["input"];
};

export type PdGreetTimeout = {
  __typename?: "PdGreetTimeout";
  hours: Scalars["Int"]["output"];
  minutes: Scalars["Int"]["output"];
};

export type PdGreetTimeoutInput = {
  hours: Scalars["Int"]["input"];
  minutes: Scalars["Int"]["input"];
};

export type PdGreeterStatus = {
  __typename?: "PdGreeterStatus";
  available?: Maybe<Scalars["Boolean"]["output"]>;
  availableAt?: Maybe<Site>;
  id: Scalars["ID"]["output"];
  sectionAssignments: Array<PdGreetSection>;
  sectionEnabled: Scalars["Boolean"]["output"];
};

export type PdGreeterStatusUpdateInput = {
  available: Scalars["Boolean"]["input"];
  sectionAssignments?: InputMaybe<Array<PdGreetSectionInput>>;
  siteId: Scalars["ID"]["input"];
};

export type PdGuestAction = {
  assignee?: Maybe<PdHost>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
};

/** Guest action filters. */
export enum PdGuestActionType {
  Greet = "GREET",
  Recommendation = "RECOMMENDATION"
}

export type PdGuestAttributeConfig = {
  __typename?: "PdGuestAttributeConfig";
  enabled: Scalars["Boolean"]["output"];
  kind: GuestAttributeKind;
};

export type PdGuestAttributeConfigInput = {
  enabled: Scalars["Boolean"]["input"];
  kind: GuestAttributeKind;
};

export type PdGuestCommunication = {
  __typename?: "PdGuestCommunication";
  communicatedAt: Scalars["DateTime"]["output"];
  /** The host that communicated with the player. */
  communicatedBy?: Maybe<PdHost>;
  guest?: Maybe<Player>;
  id: Scalars["ID"]["output"];
  note: Scalars["String"]["output"];
  type: PdTaskContactType;
};

export type PdGuestCommunicationConnection = {
  __typename?: "PdGuestCommunicationConnection";
  /** A list of edges. */
  edges: Array<PdGuestCommunicationEdge>;
  /** A list of nodes. */
  nodes: Array<PdGuestCommunication>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type PdGuestCommunicationEdge = {
  __typename?: "PdGuestCommunicationEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: PdGuestCommunication;
};

export type PdGuestEvent = {
  __typename?: "PdGuestEvent";
  eventTime: Scalars["DateTime"]["output"];
  eventType: GuestEventType;
  id: Scalars["ID"]["output"];
  standId?: Maybe<Scalars["String"]["output"]>;
};

export enum PdGuestInteractionType {
  All = "ALL",
  Coded = "CODED",
  Uncoded = "UNCODED"
}

export type PdGuestLastContact = {
  __typename?: "PdGuestLastContact";
  lastContactedAt: Scalars["DateTime"]["output"];
};

export type PdGuestMetricFilter = {
  dateRange?: InputMaybe<PdMetricDateRange>;
  members?: InputMaybe<Array<Scalars["String"]["input"]>>;
  metric: Scalars["ID"]["input"];
  range?: InputMaybe<Array<InputMaybe<Scalars["Float"]["input"]>>>;
};

/** A group of filters that are combined with an AND operator. */
export type PdGuestMetricFilterGroup = {
  filters: Array<PdGuestMetricFilter>;
};

export type PdGuestMetricTable = {
  __typename?: "PdGuestMetricTable";
  columns: Array<Maybe<Array<Maybe<Scalars["JSON"]["output"]>>>>;
  formats: Array<Maybe<PdMetricFormat>>;
  guestIds: Array<Scalars["ID"]["output"]>;
  headers: Array<Scalars["String"]["output"]>;
};

/** Guest search filter */
export type PdGuestSearchFilter = {
  /**
   * Coded guest filter
   *
   * If `true`, only return guests that are coded.
   * If `false`, only return guests that are not coded.
   */
  coded?: InputMaybe<Scalars["Boolean"]["input"]>;
  /**
   * My guest filter
   *
   * If `true`, only return guests that are assigned to the current user.
   * If `false`, only return guests that are not assigned to the current user.
   */
  myGuests?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type PdGuestSortingAttribute = {
  name: PdGuestSortingAttributeName;
  order: PdGuestSortingOrder;
};

export enum PdGuestSortingAttributeName {
  LastContactedAt = "LAST_CONTACTED_AT"
}

export enum PdGuestSortingOrder {
  Asc = "ASC",
  Desc = "DESC"
}

export type PdHost = {
  __typename?: "PdHost";
  /** Number of assigned guests. */
  assignedGuestCount?: Maybe<Scalars["Int"]["output"]>;
  firstName: Scalars["String"]["output"];
  /** Host's goal programs. */
  goalPrograms?: Maybe<Array<PdGoalProgram>>;
  /** Host greet status. */
  greeterStatus?: Maybe<PdGreeterStatus>;
  id: Scalars["ID"]["output"];
  /** Is the host mapped to the current user */
  isMappedToMe?: Maybe<Scalars["Boolean"]["output"]>;
  lastName: Scalars["String"]["output"];
  /** Host's recent communications */
  recentCommunications: PdGuestCommunicationConnection;
};

export type PdHostRecentCommunicationsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  communicationType?: InputMaybe<PdTaskContactType>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type PdHostMapping = {
  __typename?: "PdHostMapping";
  id: Scalars["ID"]["output"];
  nativeHost?: Maybe<PdNativeHost>;
  nativeHostId: Scalars["ID"]["output"];
  siteId: Scalars["ID"]["output"];
  user?: Maybe<User>;
};

export type PdHostMappingUpdateInput = {
  /** A list of native host ids. */
  nativeHostIds: Array<Scalars["ID"]["input"]>;
  siteId: Scalars["ID"]["input"];
  userId: Scalars["ID"]["input"];
};

export type PdLastTrip = {
  __typename?: "PdLastTrip";
  date: Scalars["NaiveDate"]["output"];
};

export type PdLayout = {
  __typename?: "PdLayout";
  id: Scalars["ID"]["output"];
  layout: PdLayoutDefinition;
};

export type PdLayoutComponentInput = {
  dimensions: PdLayoutGridStackDimensionInput;
  props: Scalars["JSON"]["input"];
  type: Scalars["String"]["input"];
};

export type PdLayoutCustomComponent = PdLayoutGridStackComponent & {
  __typename?: "PdLayoutCustomComponent";
  dimensions: PdLayoutGridStackDimension;
  props: Scalars["JSON"]["output"];
  type: Scalars["String"]["output"];
};

/** Pd Engage Layout definition. */
export type PdLayoutDefinition = PdLayoutGridStack;

/**
 * Layout using [`GridStack`].
 *
 * [`GridStack`]: https://github.com/gridstack/gridstack.js
 */
export type PdLayoutGridStack = {
  __typename?: "PdLayoutGridStack";
  config: PdLayoutGridStackConfig;
  items: Array<PdLayoutGridStackComponent>;
  sisenseDashboard?: Maybe<PdLayoutSisenseDashboardReference>;
};

export type PdLayoutGridStackComponent = {
  dimensions: PdLayoutGridStackDimension;
  props: Scalars["JSON"]["output"];
  type: Scalars["String"]["output"];
};

/** GridStack layout configuration. */
export type PdLayoutGridStackConfig = {
  __typename?: "PdLayoutGridStackConfig";
  /** Max columns. */
  maxColumns: Scalars["Int"]["output"];
};

/** GridStack layout configuration. */
export type PdLayoutGridStackConfigInput = {
  /** Max columns. */
  maxColumns: Scalars["Int"]["input"];
};

export type PdLayoutGridStackDimension = {
  __typename?: "PdLayoutGridStackDimension";
  h: Scalars["Int"]["output"];
  w: Scalars["Int"]["output"];
  x: Scalars["Int"]["output"];
  y: Scalars["Int"]["output"];
};

export type PdLayoutGridStackDimensionInput = {
  h: Scalars["Int"]["input"];
  w: Scalars["Int"]["input"];
  x: Scalars["Int"]["input"];
  y: Scalars["Int"]["input"];
};

export type PdLayoutGridStackInput = {
  config: PdLayoutGridStackConfigInput;
  items: Array<PdLayoutComponentInput>;
};

export type PdLayoutSisenseComponent = PdLayoutGridStackComponent & {
  __typename?: "PdLayoutSisenseComponent";
  dimensions: PdLayoutGridStackDimension;
  props: Scalars["JSON"]["output"];
  type: Scalars["String"]["output"];
};

export type PdLayoutSisenseDashboardReference = {
  __typename?: "PdLayoutSisenseDashboardReference";
  dashboard?: Maybe<OdrDashboard>;
};

export type PdLayoutUpdateInput = {
  /** Layout configuration in JSON format. */
  gridStackLayout: PdLayoutGridStackInput;
  /** Layout name. */
  name: Scalars["String"]["input"];
};

export type PdLayoutV2 = {
  __typename?: "PdLayoutV2";
  id: Scalars["ID"]["output"];
  sections: Array<PdLayoutV2Section>;
};

/** A component is a widget that is displayed in a row. */
export type PdLayoutV2Component = {
  componentType: PdLayoutV2ComponentType;
  widget: Scalars["String"]["output"];
};

export type PdLayoutV2ComponentInput = {
  componentType: PdLayoutV2ComponentType;
  widget: Scalars["String"]["input"];
};

export type PdLayoutV2ComponentList = PdLayoutV2RowContent & {
  __typename?: "PdLayoutV2ComponentList";
  components: Array<PdLayoutV2Component>;
  type: PdLayoutV2RowContentType;
};

export enum PdLayoutV2ComponentType {
  CustomComponent = "CUSTOM_COMPONENT",
  SisenseWidget = "SISENSE_WIDGET"
}

export type PdLayoutV2CustomComponent = PdLayoutV2Component & {
  __typename?: "PdLayoutV2CustomComponent";
  componentType: PdLayoutV2ComponentType;
  widget: Scalars["String"]["output"];
};

/** Two components that are displayed side by side. */
export type PdLayoutV2DualComponent = {
  __typename?: "PdLayoutV2DualComponent";
  components: Array<PdLayoutV2Component>;
  title: Scalars["String"]["output"];
};

export type PdLayoutV2DualComponentList = PdLayoutV2RowContent & {
  __typename?: "PdLayoutV2DualComponentList";
  components: Array<PdLayoutV2DualComponent>;
  type: PdLayoutV2RowContentType;
};

export type PdLayoutV2Input = {
  id: Scalars["ID"]["input"];
  sections: Array<PdLayoutV2SectionInput>;
};

/**
 * A `PdLayoutRow` is a collection of components
 * that is displayed horizontally.
 */
export type PdLayoutV2Row = {
  __typename?: "PdLayoutV2Row";
  config: PdLayoutV2RowConfig;
  content: PdLayoutV2RowContent;
};

/** Configuration for a `PdLayoutRow`. */
export type PdLayoutV2RowConfig = {
  __typename?: "PdLayoutV2RowConfig";
  /** Whether the row is editable. */
  editable: Scalars["Boolean"]["output"];
  sisenseWidgetType: PdLayoutV2SisenseWidgetType;
};

/** Content of a `PdLayoutRow`. */
export type PdLayoutV2RowContent = {
  type: PdLayoutV2RowContentType;
};

export type PdLayoutV2RowContentInput = {
  components: Array<PdLayoutV2ComponentInput>;
  type: PdLayoutV2RowContentType;
};

export enum PdLayoutV2RowContentType {
  Dual = "DUAL",
  Simple = "SIMPLE"
}

export type PdLayoutV2RowInput = {
  content?: InputMaybe<PdLayoutV2RowContentInput>;
};

/** A `PdLayoutSection` is a collection of rows. */
export type PdLayoutV2Section = {
  __typename?: "PdLayoutV2Section";
  /** Supporting the use case of showing the `DefectionRisk` for the `Guest future value` section. */
  header?: Maybe<PdLayoutV2Component>;
  /** Is this section hidden. */
  hidden: Scalars["Boolean"]["output"];
  /**
   * A unique identifier for the section.
   *
   * The `id` is used as a key to identify the section,
   * when changing section order, or hiding a section.
   */
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  /** The rows of the section. */
  rows: Array<PdLayoutV2Row>;
  sisenseDashboard?: Maybe<OdrDashboard>;
};

export type PdLayoutV2SectionInput = {
  header?: InputMaybe<PdLayoutV2ComponentInput>;
  hidden?: InputMaybe<Scalars["Boolean"]["input"]>;
  id: Scalars["ID"]["input"];
  rows?: InputMaybe<Array<PdLayoutV2RowInput>>;
};

export type PdLayoutV2SisenseWidget = PdLayoutV2Component & {
  __typename?: "PdLayoutV2SisenseWidget";
  componentType: PdLayoutV2ComponentType;
  widget: Scalars["String"]["output"];
};

/** The type of sisense widget can be used in a `PdLayoutV2Row`. */
export enum PdLayoutV2SisenseWidgetType {
  /** Any widget type. */
  All = "ALL",
  /** Only indicator widgets. */
  Indicator = "INDICATOR",
  /** Only non-indicator widgets. */
  NonIndicator = "NON_INDICATOR"
}

export type PdMarketingProgram = {
  __typename?: "PdMarketingProgram";
  actionsCreated: Scalars["Int"]["output"];
  createdBy: User;
  dueDate: Scalars["NaiveDate"]["output"];
  guestsSelected: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  modifiedAt: Scalars["DateTime"]["output"];
  name: Scalars["String"]["output"];
  startDate: Scalars["NaiveDate"]["output"];
  status?: Maybe<PdMarketingProgramStatus>;
};

export type PdMarketingProgramActionReason = {
  __typename?: "PdMarketingProgramActionReason";
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
};

export type PdMarketingProgramDeleteInput = {
  id: Scalars["ID"]["input"];
  siteId: Scalars["ID"]["input"];
};

export type PdMarketingProgramGuestCriteria = {
  /** A list of filter groups that are combined with an OR operator. */
  filterGroups: Array<PdGuestMetricFilterGroup>;
  hosted?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type PdMarketingProgramGuestList = {
  __typename?: "PdMarketingProgramGuestList";
  guestCount: Scalars["Int"]["output"];
  metricTable?: Maybe<PdGuestMetricTable>;
};

export type PdMarketingProgramGuestMetric = {
  __typename?: "PdMarketingProgramGuestMetric";
  dateRangeTypes: Array<PdMetricDateRangeType>;
  id: Scalars["ID"]["output"];
  label: Scalars["String"]["output"];
};

export enum PdMarketingProgramStatus {
  Current = "CURRENT",
  Future = "FUTURE",
  History = "HISTORY"
}

export type PdMetricCustomDateRange = {
  end: Scalars["NaiveDate"]["input"];
  start: Scalars["NaiveDate"]["input"];
};

export type PdMetricDateRange = {
  customRange?: InputMaybe<PdMetricCustomDateRange>;
  futurePreset?: InputMaybe<PdMetricFuturePresetPeriod>;
  lastNTrips?: InputMaybe<Scalars["Int"]["input"]>;
  pastPreset?: InputMaybe<PdMetricPastPresetPeriod>;
  tripPreset?: InputMaybe<PdMetricPresetTripRange>;
};

export enum PdMetricDateRangeType {
  CustomRange = "CUSTOM_RANGE",
  FuturePreset = "FUTURE_PRESET",
  LastNTrips = "LAST_N_TRIPS",
  PastPreset = "PAST_PRESET",
  TripPreset = "TRIP_PRESET"
}

export enum PdMetricFormat {
  Currency = "CURRENCY",
  Number = "NUMBER",
  Percentage = "PERCENTAGE",
  String = "STRING"
}

export enum PdMetricFuturePresetPeriod {
  Next_30Days = "NEXT_30_DAYS",
  Next_90Days = "NEXT_90_DAYS",
  Next_180Days = "NEXT_180_DAYS",
  Next_365Days = "NEXT_365_DAYS"
}

export enum PdMetricPastPresetPeriod {
  Last_30Days = "LAST_30_DAYS",
  Last_90Days = "LAST_90_DAYS",
  Last_180Days = "LAST_180_DAYS",
  Last_365Days = "LAST_365_DAYS"
}

export enum PdMetricPresetTripRange {
  LastTrip = "LAST_TRIP",
  ThisTrip = "THIS_TRIP"
}

export type PdNativeHost = {
  __typename?: "PdNativeHost";
  firstName: Scalars["String"]["output"];
  lastName: Scalars["String"]["output"];
  nativeHostId: Scalars["ID"]["output"];
  siteId: Scalars["ID"]["output"];
};

export type PdNativeHostInput = {
  nativeHostId: Scalars["ID"]["input"];
  siteId: Scalars["ID"]["input"];
};

export type PdOrgSettings = {
  __typename?: "PdOrgSettings";
  guestAttributes: Array<PdGuestAttributeConfig>;
  guestTimePeriods: Array<PdTimePeriod>;
  /** @deprecated Use `hostTimePeriods` instead */
  hostSummaryTimePeriods: Array<PdTimePeriod>;
  hostTimePeriods: Array<PdTimePeriod>;
  id: Scalars["ID"]["output"];
  lookbackDays: Scalars["Int"]["output"];
  maxTasksPerHost: Scalars["Int"]["output"];
  maxTasksPerView: Scalars["Int"]["output"];
  taskScheduler: PdSchedulerRunTime;
  tiers: Array<PdTier>;
  /** @deprecated Use `guestTimePeriods` instead */
  timePeriods: Array<PdTimePeriod>;
  valueMetric: PdValueMetric;
  worthPercentage: Scalars["Int"]["output"];
};

export type PdOrgSettingsInput = {
  guestAttributes?: InputMaybe<Array<PdGuestAttributeConfigInput>>;
  guestTimePeriods?: InputMaybe<Array<PdTimePeriodInput>>;
  hostTimePeriods?: InputMaybe<Array<PdTimePeriodInput>>;
  lookbackDays?: InputMaybe<Scalars["Int"]["input"]>;
  maxTasksPerHost?: InputMaybe<Scalars["Int"]["input"]>;
  maxTasksPerView?: InputMaybe<Scalars["Int"]["input"]>;
  taskScheduler?: InputMaybe<PdSchedulerRunTimeInput>;
  tiers?: InputMaybe<Array<PdTierInput>>;
  timePeriods?: InputMaybe<Array<PdTimePeriodInput>>;
  valueMetric?: InputMaybe<PdValueMetric>;
  worthPercentage?: InputMaybe<Scalars["Int"]["input"]>;
};

export type PdParsedGuestList = {
  __typename?: "PdParsedGuestList";
  matchedGuests: Array<Player>;
  unmatchedGuestIds: Array<Scalars["ID"]["output"]>;
};

export type PdPhone = {
  __typename?: "PdPhone";
  number: Scalars["String"]["output"];
};

export type PdRule = {
  __typename?: "PdRule";
  code: Scalars["String"]["output"];
  config?: Maybe<PdRuleConfig>;
  description: Scalars["String"]["output"];
  evaluate?: Maybe<PdEvaluationResult>;
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  siteId?: Maybe<Scalars["ID"]["output"]>;
};

export type PdRuleEvaluateArgs = {
  config?: InputMaybe<PdEvaluationExecutorConfigInput>;
  input: PdEvaluationPlayerInput;
};

export type PdRuleConfig = {
  __typename?: "PdRuleConfig";
  code: Scalars["String"]["output"];
  enabled: Scalars["Boolean"]["output"];
  id: Scalars["ID"]["output"];
  siteId: Scalars["Int"]["output"];
  weight: Scalars["Int"]["output"];
};

export type PdRuleConfigUpdateInput = {
  enabled: Scalars["Boolean"]["input"];
  ruleCode: Scalars["String"]["input"];
  siteId: Scalars["ID"]["input"];
  weight: Scalars["Int"]["input"];
};

export type PdRuleMatch = {
  __typename?: "PdRuleMatch";
  code?: Maybe<Scalars["String"]["output"]>;
  points?: Maybe<Scalars["Decimal"]["output"]>;
  ruleName?: Maybe<Scalars["String"]["output"]>;
  weighting?: Maybe<Scalars["Int"]["output"]>;
};

export type PdSchedulerRunTime = {
  __typename?: "PdSchedulerRunTime";
  hour: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  minute: Scalars["Int"]["output"];
  timezone: Scalars["String"]["output"];
};

export type PdSchedulerRunTimeInput = {
  hour: Scalars["Int"]["input"];
  minute: Scalars["Int"]["input"];
  timezone: Scalars["String"]["input"];
};

export type PdTask = PdGuestAction & {
  __typename?: "PdTask";
  /** Assigned Host */
  assignee?: Maybe<PdHost>;
  /** Task creation time. */
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  /** Task id. */
  id: Scalars["ID"]["output"];
  /** Player Attributes and Period Metric Metadata. */
  player?: Maybe<Player>;
  /** Rules triggered to generate the Task. */
  rulesMatched: Array<PdRuleMatch>;
  /** Number of rules matched to generate the Task. */
  rulesMatchedCount?: Maybe<Scalars["Int"]["output"]>;
  /** Weighted total score of the matched rules. */
  score?: Maybe<Scalars["Int"]["output"]>;
  /** When will the task be displayed on the task list again. */
  snoozeUntil?: Maybe<Scalars["DateTime"]["output"]>;
  /** Status of the task. */
  status?: Maybe<PdTaskStatus>;
};

export type PdTaskCompleteInput = {
  /** Type of contact between the host and player */
  contactType?: InputMaybe<PdTaskContactType>;
  /** Any notes relevant to the the Task */
  note?: InputMaybe<Scalars["String"]["input"]>;
  /** Site ID */
  siteId: Scalars["ID"]["input"];
  /** Task identifier */
  taskId: Scalars["ID"]["input"];
};

export type PdTaskConnection = {
  __typename?: "PdTaskConnection";
  /** A list of edges. */
  edges: Array<PdTaskEdge>;
  /** A list of nodes. */
  nodes: Array<PdTask>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** The type of contact conducted for a task */
export enum PdTaskContactType {
  /** Contact was made via email */
  Email = "EMAIL",
  /** Contact was made in person */
  InPerson = "IN_PERSON",
  /** Contact was made via phone call */
  PhoneCall = "PHONE_CALL",
  /** Contact was made via text */
  Text = "TEXT"
}

export type PdTaskDismissInput = {
  /** Any notes relevant to the the Task */
  note?: InputMaybe<Scalars["String"]["input"]>;
  /** Site ID */
  siteId: Scalars["ID"]["input"];
  /** Task identifier */
  taskId: Scalars["ID"]["input"];
};

/** An edge in a connection. */
export type PdTaskEdge = {
  __typename?: "PdTaskEdge";
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: PdTask;
};

export type PdTaskEngineInput = {
  endDate?: InputMaybe<Scalars["NaiveDate"]["input"]>;
  siteId: Scalars["ID"]["input"];
};

export type PdTaskSnoozeInput = {
  /** Any notes relevant to the the Task */
  note?: InputMaybe<Scalars["String"]["input"]>;
  /** Site ID */
  siteId: Scalars["ID"]["input"];
  /** Time to wait until next Task generation for this player (Only required for 'Snooze' status) */
  snoozeUntil: Scalars["DateTime"]["input"];
  /** Task identifier */
  taskId: Scalars["ID"]["input"];
};

/** Task Status */
export enum PdTaskStatus {
  /** Task was fulfilled. */
  Completed = "COMPLETED",
  /** Task was dismissed. */
  Dismissed = "DISMISSED",
  /** Task is open. */
  Open = "OPEN",
  /** Task was snoozed until a specified time. */
  Snoozed = "SNOOZED",
  /** Task is not longer valid. */
  TimedOut = "TIMED_OUT"
}

export type PdTier = {
  __typename?: "PdTier";
  /** Tier css color. */
  cssColor?: Maybe<Scalars["CssColor"]["output"]>;
  id: Scalars["ID"]["output"];
  /** Tier name. */
  name: Scalars["String"]["output"];
  /** Tier order. */
  order: Scalars["Int"]["output"];
};

export type PdTierInput = {
  /** Tier css color. */
  cssColor: Scalars["CssColor"]["input"];
  /** Tier name. */
  name: Scalars["String"]["input"];
  /**
   * Tier order.
   *
   * Start from 1, and increase by 1 for each tier.
   *
   * # Example
   *
   * * Platinum: 1
   * * Gold: 2
   * * Silver: 3
   */
  order: Scalars["Int"]["input"];
};

export type PdTimePeriod = {
  __typename?: "PdTimePeriod";
  count: Scalars["Int"]["output"];
  dateRange?: Maybe<PdTimePeriodDateRange>;
  default: Scalars["Boolean"]["output"];
  enabled: Scalars["Boolean"]["output"];
  id: Scalars["ID"]["output"];
  level: PdTimePeriodLevel;
};

export type PdTimePeriodDateRangeArgs = {
  playerId?: InputMaybe<Scalars["ID"]["input"]>;
  siteId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type PdTimePeriodDateRange = {
  __typename?: "PdTimePeriodDateRange";
  end: Scalars["DateTime"]["output"];
  start: Scalars["DateTime"]["output"];
};

/** Time Period */
export type PdTimePeriodInput = {
  count: Scalars["Int"]["input"];
  default: Scalars["Boolean"]["input"];
  enabled: Scalars["Boolean"]["input"];
  level: PdTimePeriodLevel;
};

export enum PdTimePeriodLevel {
  Days = "DAYS",
  MonthToDate = "MONTH_TO_DATE",
  PriorDays = "PRIOR_DAYS",
  PriorMonths = "PRIOR_MONTHS",
  PriorQuarters = "PRIOR_QUARTERS",
  QuarterToDate = "QUARTER_TO_DATE",
  Trips = "TRIPS",
  YearToDate = "YEAR_TO_DATE"
}

export type PdUserGroup = {
  __typename?: "PdUserGroup";
  excludeFromReports: Scalars["Boolean"]["output"];
  guestInteractionType?: Maybe<PdGuestInteractionType>;
  id: Scalars["ID"]["output"];
  members: Array<User>;
  name: Scalars["String"]["output"];
  /** Returns the rules associated with this user group */
  usedByRules: Array<PdGreetRule>;
};

export type PdUserGroupCreateInput = {
  excludeFromReports: Scalars["Boolean"]["input"];
  guestInteractionType?: InputMaybe<PdGuestInteractionType>;
  members: Array<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  nativeHosts: Array<PdNativeHostInput>;
};

export type PdUserGroupUpdateInput = {
  excludeFromReports: Scalars["Boolean"]["input"];
  guestInteractionType?: InputMaybe<PdGuestInteractionType>;
  id: Scalars["ID"]["input"];
  members: Array<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  nativeHosts: Array<PdNativeHostInput>;
};

export enum PdValueMetric {
  DailyAverage = "DAILY_AVERAGE",
  Total = "TOTAL",
  TripAverage = "TRIP_AVERAGE"
}

export type PlanBrief = {
  __typename?: "PlanBrief";
  name: Scalars["String"]["output"];
};

export type Player = {
  __typename?: "Player";
  birthday?: Maybe<Scalars["NaiveDate"]["output"]>;
  communicationSettings?: Maybe<CommunicationSettings>;
  email?: Maybe<Scalars["String"]["output"]>;
  firstName?: Maybe<Scalars["String"]["output"]>;
  /** Get an attribute. */
  guestAttribute?: Maybe<GuestAttribute>;
  /** Get all attributes. */
  guestAttributes: Array<GuestAttribute>;
  id: Scalars["ID"]["output"];
  lastName?: Maybe<Scalars["String"]["output"]>;
  nativeGuestId: Scalars["ID"]["output"];
  phone?: Maybe<Scalars["String"]["output"]>;
  siteSummary?: Maybe<PlayerSiteSummary>;
};

export type PlayerGuestAttributeArgs = {
  kind: GuestAttributeKind;
  siteId: Scalars["ID"]["input"];
};

export type PlayerGuestAttributesArgs = {
  siteId: Scalars["ID"]["input"];
};

export type PlayerSiteSummaryArgs = {
  siteId: Scalars["ID"]["input"];
};

export type PlayerSiteMetrics = {
  __typename?: "PlayerSiteMetrics";
  averageDailyActualWin?: Maybe<Scalars["Decimal"]["output"]>;
  averageDailyTheoWin?: Maybe<Scalars["Decimal"]["output"]>;
  averageDailyWorth?: Maybe<Scalars["Decimal"]["output"]>;
  totalActualWin?: Maybe<Scalars["Decimal"]["output"]>;
  totalTheoWin?: Maybe<Scalars["Decimal"]["output"]>;
  totalWorth?: Maybe<Scalars["Decimal"]["output"]>;
};

export type PlayerSiteSummary = {
  __typename?: "PlayerSiteSummary";
  /** Player active actions. */
  actions?: Maybe<Array<PdGuestAction>>;
  host?: Maybe<PdHost>;
  lastTripEndDate?: Maybe<Scalars["NaiveDate"]["output"]>;
  /** Player metrics on the site. */
  metrics?: Maybe<PlayerSiteMetrics>;
  /**
   * Recent communications with the player.
   * @deprecated use `recentCommunicationsV2` instead
   */
  recentCommunications?: Maybe<Array<PdGuestCommunication>>;
  /** Recent communications with the guest. */
  recentCommunicationsV2: PdGuestCommunicationConnection;
  /** Guest recent event. */
  recentEvent?: Maybe<PdGuestEvent>;
  /**
   * player task assigned to the current user.
   * @deprecated No longer supported
   */
  taskAssignedToMe?: Maybe<PdTask>;
  tier?: Maybe<PdTier>;
  /** @deprecated use `PlayerSiteSummary.tier` instead */
  tierName?: Maybe<Scalars["String"]["output"]>;
};

export type PlayerSiteSummaryActionsArgs = {
  assignedToMe?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type PlayerSiteSummaryRecentCommunicationsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
};

export type PlayerSiteSummaryRecentCommunicationsV2Args = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  communicationType?: InputMaybe<PdTaskContactType>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type Query = {
  __typename?: "Query";
  applications: Array<Application>;
  currentApp?: Maybe<Application>;
  /** @deprecated Use `currentOrg` instead */
  currentCompany?: Maybe<Company>;
  currentOrg?: Maybe<Org>;
  currentUser?: Maybe<User>;
  dataFeedStatus?: Maybe<DataFeedStatus>;
  discovery: Discovery;
  emailExists: Scalars["Boolean"]["output"];
  heatMapInventory?: Maybe<Array<HeatMap>>;
  heatMapInventorySearch?: Maybe<Array<HeatMap>>;
  license?: Maybe<License>;
  licenseValidate?: Maybe<LicenseStatus>;
  noAccessUserFind?: Maybe<User>;
  /** @deprecated No longer supported */
  odrDashboard: OdrDashboard;
  odrDashboardFolders: Array<OdrDashboardFolder>;
  odrDashboards: Array<OdrDashboardBrief>;
  odrDataConnector?: Maybe<OdrDataConnector>;
  odrDataConnectors?: Maybe<Array<OdrDataConnector>>;
  odrDataSources?: Maybe<Array<OdrDataSource>>;
  odrFilterOptions: OdrJaqlValueConnection;
  odrJob?: Maybe<OdrJob>;
  odrJobs: Array<OdrJob>;
  org?: Maybe<Org>;
  orgApps: Array<OrgApp>;
  orgHeatMaps?: Maybe<Array<OrgHeatMap>>;
  orgLicenses: Array<OrgLicense>;
  orgSearch?: Maybe<Array<Org>>;
  orgs: Array<Org>;
  /** Get a action */
  pdAction?: Maybe<PdGuestAction>;
  /** Get a list of actions */
  pdActions: Array<PdGuestAction>;
  /** Current host. */
  pdCurrentHost?: Maybe<PdHost>;
  /**
   * Get metric list for inclusion in Host Programs
   *
   * An invalid site_id will return an empty list of metrics
   */
  pdGoalMetrics: Array<PdGoalProgramMetric>;
  /**
   * Get goal program details
   *
   * An invalid site_id or program_id will return a null goalProgram
   */
  pdGoalProgram?: Maybe<PdGoalProgram>;
  /** Get a list of goal programs. */
  pdGoalPrograms: Array<PdGoalProgram>;
  /**
   * Get metric list
   *
   * An invalid tenant_id will return an empty list of metrics
   */
  pdGreetMetrics: Array<PdGreetMetricDefinition>;
  /**
   * Get rule details
   *
   * An invalid tenant_id or rule_id will return an empty detail
   */
  pdGreetRule?: Maybe<PdGreetRule>;
  /**
   * Get rules list
   *
   * An invalid tenant_id will return an empty list of rules
   */
  pdGreetRules: Array<PdGreetRule>;
  pdGreetSections: Array<PdGreetSection>;
  /** Get PD greet setting */
  pdGreetSettings?: Maybe<PdGreetSettings>;
  pdGuest?: Maybe<Player>;
  /** Search guests */
  pdGuestSearch?: Maybe<Array<Player>>;
  /** Get host mappings */
  pdHostMappings?: Maybe<Array<PdHostMapping>>;
  /**
   * Load layout
   *
   * An error will be returned when the `name` of the layout is not defined in the system.
   */
  pdLayout?: Maybe<PdLayout>;
  /**
   * Load pd layout v2.
   *
   * An error will be returned when the `name` of the layout is not defined in the system.
   */
  pdLayoutV2?: Maybe<PdLayoutV2>;
  /** Get a list of marketing program action reasons. */
  pdMarketingProgramActionReasons: Array<PdMarketingProgramActionReason>;
  /** Load Guest List along with the metrics for a marketing program. */
  pdMarketingProgramGuestList?: Maybe<PdMarketingProgramGuestList>;
  /** Get a list of marketing program metrics. */
  pdMarketingProgramGuestMetrics: Array<PdMarketingProgramGuestMetric>;
  /** Get a list of marketing programs. */
  pdMarketingPrograms: Array<PdMarketingProgram>;
  /** Get a list of unmapped users. */
  pdNativeHosts: Array<PdNativeHost>;
  /** Get PD org settings */
  pdOrgSettings?: Maybe<PdOrgSettings>;
  /** Get a parsed guest list from native guest IDs. */
  pdParseGuestList: PdParsedGuestList;
  /** Get a rule by code */
  pdRule?: Maybe<PdRule>;
  /** Get a list of rules */
  pdRules: Array<PdRule>;
  /**
   * Get a task
   * @deprecated Use `pdAction` instead.
   */
  pdTask?: Maybe<PdTask>;
  /**
   * Get a list of tasks
   * @deprecated use `pdActions` instead.
   */
  pdTasks: PdTaskConnection;
  /** Get a user group by id. */
  pdUserGroup?: Maybe<PdUserGroup>;
  /** Get a list of user groups. */
  pdUserGroups: Array<PdUserGroup>;
  /** Get an property by id */
  site?: Maybe<Site>;
  /** Get all properties */
  sites?: Maybe<Array<Site>>;
  subscriptionPlans: Array<SubscriptionPlan>;
  /** Get a user in the org. */
  user?: Maybe<User>;
  /** List all users in the org. */
  users?: Maybe<Array<User>>;
  /** Get a base64 encoded VAPID public key. */
  webPushApplicationServerKey?: Maybe<WebPushPublicKey>;
};

export type QueryEmailExistsArgs = {
  email: Scalars["String"]["input"];
};

export type QueryHeatMapInventoryArgs = {
  siteId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type QueryHeatMapInventorySearchArgs = {
  keyword?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryLicenseValidateArgs = {
  key: Scalars["String"]["input"];
};

export type QueryNoAccessUserFindArgs = {
  firstName: Scalars["String"]["input"];
  lastName: Scalars["String"]["input"];
};

export type QueryOdrDashboardArgs = {
  id: Scalars["String"]["input"];
};

export type QueryOdrDashboardFoldersArgs = {
  siteId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type QueryOdrDataConnectorArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryOdrFilterOptionsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  dashboardId: Scalars["ID"]["input"];
  filterTitle: Scalars["String"]["input"];
  first: Scalars["Int"]["input"];
  keyword: Scalars["String"]["input"];
  siteId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type QueryOdrJobArgs = {
  jobId: Scalars["ID"]["input"];
};

export type QueryOdrJobsArgs = {
  jobIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type QueryOrgArgs = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryOrgLicensesArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryOrgSearchArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  query: Scalars["String"]["input"];
};

export type QueryPdActionArgs = {
  actionId: Scalars["ID"]["input"];
  actionType?: InputMaybe<PdGuestActionType>;
  siteId: Scalars["ID"]["input"];
};

export type QueryPdActionsArgs = {
  actionType?: InputMaybe<PdGuestActionType>;
  limit: Scalars["Int"]["input"];
  siteId: Scalars["ID"]["input"];
};

export type QueryPdCurrentHostArgs = {
  siteId: Scalars["ID"]["input"];
};

export type QueryPdGoalProgramArgs = {
  programId: Scalars["ID"]["input"];
  siteId: Scalars["ID"]["input"];
};

export type QueryPdGoalProgramsArgs = {
  siteId: Scalars["ID"]["input"];
};

export type QueryPdGreetRuleArgs = {
  ruleId: Scalars["ID"]["input"];
  siteId: Scalars["ID"]["input"];
};

export type QueryPdGreetRulesArgs = {
  siteId: Scalars["ID"]["input"];
};

export type QueryPdGreetSectionsArgs = {
  siteId: Scalars["ID"]["input"];
};

export type QueryPdGuestArgs = {
  guestId: Scalars["ID"]["input"];
};

export type QueryPdGuestSearchArgs = {
  filter?: InputMaybe<PdGuestSearchFilter>;
  keyword: Scalars["String"]["input"];
  limit: Scalars["Int"]["input"];
  siteId: Scalars["ID"]["input"];
  sort?: InputMaybe<Array<PdGuestSortingAttribute>>;
};

export type QueryPdHostMappingsArgs = {
  siteId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type QueryPdLayoutArgs = {
  name: Scalars["String"]["input"];
};

export type QueryPdLayoutV2Args = {
  id: Scalars["String"]["input"];
};

export type QueryPdMarketingProgramGuestListArgs = {
  criteria?: InputMaybe<PdMarketingProgramGuestCriteria>;
  includedGuestIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  siteId: Scalars["ID"]["input"];
};

export type QueryPdMarketingProgramsArgs = {
  siteId: Scalars["ID"]["input"];
};

export type QueryPdNativeHostsArgs = {
  includeMapped?: InputMaybe<Scalars["Boolean"]["input"]>;
  siteId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type QueryPdParseGuestListArgs = {
  nativeGuestIds: Scalars["String"]["input"];
  siteId: Scalars["ID"]["input"];
};

export type QueryPdRuleArgs = {
  ruleCode: Scalars["String"]["input"];
  siteId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type QueryPdRulesArgs = {
  siteId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type QueryPdTaskArgs = {
  siteId: Scalars["ID"]["input"];
  taskId: Scalars["ID"]["input"];
};

export type QueryPdTasksArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  keyword?: InputMaybe<Scalars["String"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
  siteId: Scalars["ID"]["input"];
};

export type QueryPdUserGroupArgs = {
  id: Scalars["ID"]["input"];
};

export type QuerySiteArgs = {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  idV2?: InputMaybe<Scalars["ID"]["input"]>;
};

export type QueryUserArgs = {
  id: Scalars["String"]["input"];
};

export type SettingsUpdateInput = {
  maxRemainingDays?: InputMaybe<Scalars["Int"]["input"]>;
  multiProperties?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type SisenseDataObject = {
  __typename?: "SisenseDataObject";
  status: Scalars["String"]["output"];
  version: Scalars["String"]["output"];
};

/** A site is a property in a Casino. */
export type Site = {
  __typename?: "Site";
  currency?: Maybe<Currency>;
  dataFeedMapping?: Maybe<FeedSiteMapping>;
  /** @deprecated Use `idV2` instead */
  id: Scalars["Int"]["output"];
  /** Site id. */
  idV2: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  /** Load native site mapping. */
  nativeSiteMapping?: Maybe<NativeSiteMapping>;
  odrSlotLatestBuild?: Maybe<OdrSlotLatestBuild>;
  /** Load a guest action. */
  pdAction?: Maybe<PdGuestAction>;
  /** Load all actions. */
  pdActions: Array<PdGuestAction>;
  pdGreetSections: Array<PdGreetSection>;
  /** Load all user host mappings for the site. */
  pdHostMappings?: Maybe<Array<PdHostMapping>>;
  /** Load all available native host ids from UDM. */
  pdNativeHostIds?: Maybe<Array<Scalars["ID"]["output"]>>;
  /**
   * Load a player development task.
   * @deprecated Use `pdAction` instead.
   */
  pdTask?: Maybe<PdTask>;
  /**
   * Load all player development tasks.
   * @deprecated Use `pdTasks` instead.
   */
  pdTasks: PdTaskConnection;
  slotDataSource?: Maybe<SlotSiteDataSource>;
  slotReportLatestUpload?: Maybe<SlotReportUpload>;
  tz?: Maybe<Scalars["TimeZone"]["output"]>;
};

/** A site is a property in a Casino. */
export type SitePdActionArgs = {
  actionId: Scalars["ID"]["input"];
  actionType?: InputMaybe<PdGuestActionType>;
};

/** A site is a property in a Casino. */
export type SitePdActionsArgs = {
  actionType?: InputMaybe<PdGuestActionType>;
  limit: Scalars["Int"]["input"];
};

/** A site is a property in a Casino. */
export type SitePdTaskArgs = {
  taskId: Scalars["ID"]["input"];
};

/** A site is a property in a Casino. */
export type SitePdTasksArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  keyword?: InputMaybe<Scalars["String"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SiteCreateInput = {
  currencyCode?: InputMaybe<Scalars["CurrencyCode"]["input"]>;
  name: Scalars["String"]["input"];
  tz?: InputMaybe<Scalars["TimeZone"]["input"]>;
};

export type SiteUpdate = {
  currencyCode?: InputMaybe<Scalars["CurrencyCode"]["input"]>;
  name: Scalars["String"]["input"];
  tz?: InputMaybe<Scalars["TimeZone"]["input"]>;
};

export type SlotAddon = {
  __typename?: "SlotAddon";
  quantity: Scalars["Int"]["output"];
  upperRange: Scalars["Int"]["output"];
};

export enum SlotDataSourceType {
  CsvUpload = "CSV_UPLOAD",
  DataFeed = "DATA_FEED"
}

export type SlotReportUpload = {
  __typename?: "SlotReportUpload";
  id: Scalars["ID"]["output"];
  lastGamingDate: Scalars["NaiveDate"]["output"];
  maxDateRange: Scalars["Int"]["output"];
  minDateRange: Scalars["Int"]["output"];
};

export type SlotSiteDataSource = {
  __typename?: "SlotSiteDataSource";
  id: Scalars["ID"]["output"];
  type: SlotDataSourceType;
};

export type Status = {
  __typename?: "Status";
  allowedActions: Array<Action>;
  autoRenew?: Maybe<Scalars["Boolean"]["output"]>;
  canceledAt?: Maybe<Scalars["DateTime"]["output"]>;
  currentPeriodEndsAt?: Maybe<Scalars["DateTime"]["output"]>;
  currentPeriodStartedAt?: Maybe<Scalars["DateTime"]["output"]>;
  expiresAt?: Maybe<Scalars["DateTime"]["output"]>;
  isValid: Scalars["Boolean"]["output"];
  pausedAt?: Maybe<Scalars["DateTime"]["output"]>;
  status: SubscriptionStatus;
  trialEndsAt?: Maybe<Scalars["DateTime"]["output"]>;
  trialStartedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type SubscriptionCreateInput = {
  /** Customize the subscription's end date. */
  periodEndDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  planId: Scalars["ID"]["input"];
  /**
   * Slot number limit for slots.
   *
   * Only valid for `sre` and `sras`.
   */
  slotNumber?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SubscriptionPlan = {
  __typename?: "SubscriptionPlan";
  /**
   * Application name.
   * @deprecated Use `appName` instead
   */
  appFullName?: Maybe<Scalars["String"]["output"]>;
  /** Application id. */
  appId?: Maybe<AppId>;
  /** Application name. */
  appName?: Maybe<Scalars["String"]["output"]>;
  /**
   * Billing interval.
   *
   * ANNUAL or MONTHLY.
   */
  billingInterval: BillingInterval;
  /** Icon */
  icon?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  /** Is the plan for on-prem. */
  isOnprem?: Maybe<Scalars["Boolean"]["output"]>;
  /** Display name. */
  name: Scalars["String"]["output"];
  /**
   * Package
   *
   * Premium or Standard.
   */
  package?: Maybe<Scalars["String"]["output"]>;
};

export enum SubscriptionStatus {
  Active = "ACTIVE",
  Canceled = "CANCELED",
  Expired = "EXPIRED",
  Paused = "PAUSED",
  Trial = "TRIAL"
}

export type SubscriptionTerminateInput = {
  subscriptionId: Scalars["ID"]["input"];
};

export type SubscriptionUpdateInput = {
  /** Change a subscription's end date. */
  periodEndDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  subscriptionId: Scalars["ID"]["input"];
};

export type User = {
  __typename?: "User";
  /** User's org access level */
  accessLevel: OrgAccessLevel;
  /** User's application access list */
  accessList: Array<UserAppAccess>;
  /** User email address */
  email: Scalars["String"]["output"];
  /** User first name */
  firstName: Scalars["String"]["output"];
  /** User id. */
  id: Scalars["String"]["output"];
  /** Whether user is Admin */
  isAdmin: Scalars["Boolean"]["output"];
  /** User last name */
  lastName: Scalars["String"]["output"];
  /** Whether MFA is enabled */
  mfa?: Maybe<Scalars["Boolean"]["output"]>;
  /** The user's performance goal programs. */
  pdGoalPrograms?: Maybe<Array<PdGoalProgram>>;
  /**
   * List all host mappings for the user.
   *
   * A site_id can be provided to filter the results.
   */
  pdHostMappings?: Maybe<Array<PdHostMapping>>;
  /** The user group that the user belongs to */
  pdUserGroup?: Maybe<PdUserGroup>;
  /** User phone number */
  phone: Scalars["String"]["output"];
};

export type UserPdGoalProgramsArgs = {
  siteId: Scalars["ID"]["input"];
};

export type UserPdHostMappingsArgs = {
  siteId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type UserAccessInput = {
  accessLevel?: InputMaybe<OrgAccessLevel>;
  appAccessList?: InputMaybe<Array<AppAccessInput>>;
  userId: Scalars["String"]["input"];
};

export type UserAppAccess = {
  __typename?: "UserAppAccess";
  app: Application;
  role: AppRole;
  site: Site;
};

export type UserAppAccessGrantInput = {
  appId: Scalars["String"]["input"];
  roleId: Scalars["String"]["input"];
  siteId?: InputMaybe<Scalars["Int"]["input"]>;
  siteIdV2?: InputMaybe<Scalars["ID"]["input"]>;
  userId: Scalars["String"]["input"];
};

export type UserAppAccessGrantInputV2 = {
  appId: Scalars["String"]["input"];
  roleId: Scalars["String"]["input"];
  siteId: Scalars["ID"]["input"];
};

export type UserAppAccessRevokeInput = {
  appId: Scalars["String"]["input"];
  siteId?: InputMaybe<Scalars["Int"]["input"]>;
  siteIdV2?: InputMaybe<Scalars["ID"]["input"]>;
  userId: Scalars["String"]["input"];
};

export type UserInput = {
  accessLevel?: InputMaybe<AccessLevel>;
  email: Scalars["String"]["input"];
  firstName: Scalars["String"]["input"];
  lastName: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
};

export type UserPasswordResetInput = {
  userId: Scalars["String"]["input"];
};

export type UserProfileInput = {
  accessLevel?: InputMaybe<OrgAccessLevel>;
  accessList?: InputMaybe<Array<UserAppAccessGrantInputV2>>;
  /** To remove the email address for no-access user, passing it as empty string. */
  email?: InputMaybe<Scalars["String"]["input"]>;
  firstName?: InputMaybe<Scalars["String"]["input"]>;
  lastName?: InputMaybe<Scalars["String"]["input"]>;
  mfa?: InputMaybe<Scalars["Boolean"]["input"]>;
  /**
   * User can update their own password.
   * Omit this field when updating other user's profile.
   */
  password?: InputMaybe<Scalars["String"]["input"]>;
  phone?: InputMaybe<Scalars["String"]["input"]>;
  userId: Scalars["String"]["input"];
};

export type Versions = {
  __typename?: "Versions";
  apps?: Maybe<Scalars["String"]["output"]>;
  sisense?: Maybe<Scalars["String"]["output"]>;
  sisenseDataObject?: Maybe<SisenseDataObject>;
};

export type WebPushPublicKey = {
  __typename?: "WebPushPublicKey";
  /** applicationServerKey in base64 urlsafe nopad format. */
  base64: Scalars["String"]["output"];
};

export type WebPushRegistrationInput = {
  subscriptionInfo: WebPushSubscriptionInfo;
};

export type WebPushSubscriptionInfo = {
  auth: Scalars["String"]["input"];
  endpoint: Scalars["String"]["input"];
  p256dh: Scalars["String"]["input"];
};

export type DataFeedStatusQueryVariables = Exact<{ [key: string]: never }>;

export type DataFeedStatusQuery = {
  __typename?: "Query";
  dataFeedStatus?: { __typename?: "DataFeedStatus"; maxDate?: any | null } | null;
};

export type DataFeedSourceSiteIdsQueryVariables = Exact<{ [key: string]: never }>;

export type DataFeedSourceSiteIdsQuery = {
  __typename?: "Query";
  dataFeedStatus?: { __typename?: "DataFeedStatus"; sourceSiteIds: Array<string> } | null;
};

export type HeatMapInventoryFragment = {
  __typename?: "HeatMap";
  id: string;
  uploadedAt: any;
  attributes?: any | null;
};

export type OrgHeatMapFragment = {
  __typename?: "OrgHeatMap";
  id: string;
  floorId: string;
  sourceSiteId: string;
  effectiveFrom: any;
  heatMapId?: string | null;
};

export type HeatmapAssociateMutationVariables = Exact<{
  input: OrgHeatMapCreateInput;
}>;

export type HeatmapAssociateMutation = {
  __typename?: "Mutation";
  orgHeatmapAdd?: {
    __typename?: "OrgHeatMap";
    id: string;
    floorId: string;
    sourceSiteId: string;
    effectiveFrom: any;
    heatMapId?: string | null;
  } | null;
};

export type HeatmapDeleteAssociationMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type HeatmapDeleteAssociationMutation = {
  __typename?: "Mutation";
  orgHeatmapDelete?: boolean | null;
};

export type HeatMapInventoryQueryVariables = Exact<{
  siteId: Scalars["ID"]["input"];
}>;

export type HeatMapInventoryQuery = {
  __typename?: "Query";
  heatMapInventory?: Array<{
    __typename?: "HeatMap";
    id: string;
    uploadedAt: any;
    attributes?: any | null;
  }> | null;
};

export type HeatMapInventorySearchQueryVariables = Exact<{
  keyword: Scalars["String"]["input"];
}>;

export type HeatMapInventorySearchQuery = {
  __typename?: "Query";
  heatMapInventorySearch?: Array<{
    __typename?: "HeatMap";
    id: string;
    uploadedAt: any;
    attributes?: any | null;
  }> | null;
};

export type OrgHeatmapsQueryVariables = Exact<{ [key: string]: never }>;

export type OrgHeatmapsQuery = {
  __typename?: "Query";
  orgHeatMaps?: Array<{
    __typename?: "OrgHeatMap";
    id: string;
    floorId: string;
    sourceSiteId: string;
    effectiveFrom: any;
    heatMapId?: string | null;
  }> | null;
};

export type OrgLicenseFragment = {
  __typename?: "OrgLicense";
  id: string;
  key: string;
  issuedAt: any;
  expiresAt: any;
  lastVerifiedAt?: any | null;
  lastVerifiedVersions?: {
    __typename?: "LicenseVerification";
    app?: string | null;
    sisenseDataObject?: string | null;
  } | null;
};

export type OrgLicenseCreateMutationVariables = Exact<{ [key: string]: never }>;

export type OrgLicenseCreateMutation = {
  __typename?: "Mutation";
  orgLicenseCreate?: {
    __typename?: "OrgLicense";
    id: string;
    key: string;
    issuedAt: any;
    expiresAt: any;
    lastVerifiedAt?: any | null;
    lastVerifiedVersions?: {
      __typename?: "LicenseVerification";
      app?: string | null;
      sisenseDataObject?: string | null;
    } | null;
  } | null;
};

export type OrgLicenseEnableMutationVariables = Exact<{
  input: LicenseEnableInput;
}>;

export type OrgLicenseEnableMutation = {
  __typename?: "Mutation";
  orgLicenseEnable?: {
    __typename?: "OrgLicense";
    id: string;
    key: string;
    issuedAt: any;
    expiresAt: any;
    lastVerifiedAt?: any | null;
    lastVerifiedVersions?: {
      __typename?: "LicenseVerification";
      app?: string | null;
      sisenseDataObject?: string | null;
    } | null;
  } | null;
};

export type OrgLicenseDisableMutationVariables = Exact<{
  input: LicenseDisableInput;
}>;

export type OrgLicenseDisableMutation = {
  __typename?: "Mutation";
  orgLicenseDisable?: {
    __typename?: "OrgLicense";
    id: string;
    key: string;
    issuedAt: any;
    expiresAt: any;
    lastVerifiedAt?: any | null;
    lastVerifiedVersions?: {
      __typename?: "LicenseVerification";
      app?: string | null;
      sisenseDataObject?: string | null;
    } | null;
  } | null;
};

export type OrgLicensesQueryVariables = Exact<{ [key: string]: never }>;

export type OrgLicensesQuery = {
  __typename?: "Query";
  orgLicenses: Array<{
    __typename?: "OrgLicense";
    id: string;
    key: string;
    issuedAt: any;
    expiresAt: any;
    lastVerifiedAt?: any | null;
    lastVerifiedVersions?: {
      __typename?: "LicenseVerification";
      app?: string | null;
      sisenseDataObject?: string | null;
    } | null;
  }>;
};

export type OrgSummaryFragment = {
  __typename?: "Org";
  id: string;
  company?: { __typename?: "Company"; id: string; name: string; email: string } | null;
};

export type OrgFeaturesUpdateMutationVariables = Exact<{
  input: OrgFeaturesUpdateInput;
}>;

export type OrgFeaturesUpdateMutation = {
  __typename?: "Mutation";
  orgFeaturesUpdate: { __typename?: "OrgFeatures"; multiProperties: boolean };
};

export type DataAdapterEnableMutationVariables = Exact<{ [key: string]: never }>;

export type DataAdapterEnableMutation = {
  __typename?: "Mutation";
  dataAdapterEnable?: { __typename?: "DataAdapter"; id: string } | null;
};

export type SiteMappingUpdateMutationVariables = Exact<{
  input: FeedSiteMappingUpdateInput;
}>;

export type SiteMappingUpdateMutation = {
  __typename?: "Mutation";
  feedSiteMappingUpdate?: {
    __typename?: "FeedSiteMapping";
    id: string;
    sourceSiteId?: string | null;
  } | null;
};

export type CurrentOrgSummaryQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentOrgSummaryQuery = {
  __typename?: "Query";
  currentOrg?: {
    __typename?: "Org";
    dataAdapterAllowed?: boolean | null;
    id: string;
    company?: { __typename?: "Company"; id: string; name: string; email: string } | null;
  } | null;
};

export type OrgDataAdapterEnabledQueryVariables = Exact<{ [key: string]: never }>;

export type OrgDataAdapterEnabledQuery = {
  __typename?: "Query";
  org?: { __typename?: "Org"; id: string; dataAdapterEnabled?: boolean | null } | null;
};

export type OrgStageDatabaseQueryVariables = Exact<{ [key: string]: never }>;

export type OrgStageDatabaseQuery = {
  __typename?: "Query";
  org?: {
    __typename?: "Org";
    id: string;
    dataAdapter?: {
      __typename?: "DataAdapter";
      id: string;
      stageDb?: {
        __typename?: "DataAdapterStageDb";
        host: string;
        port: number;
        databaseName: string;
        username: string;
        password: string;
      } | null;
    } | null;
  } | null;
};

export type OrgSitesMappingQueryVariables = Exact<{ [key: string]: never }>;

export type OrgSitesMappingQuery = {
  __typename?: "Query";
  org?: {
    __typename?: "Org";
    id: string;
    sites: Array<{
      __typename?: "Site";
      id: number;
      name: string;
      dataFeedMapping?: {
        __typename?: "FeedSiteMapping";
        id: string;
        sourceSiteId?: string | null;
      } | null;
    }>;
  } | null;
};

export type OrgSitesDatasourcesQueryVariables = Exact<{ [key: string]: never }>;

export type OrgSitesDatasourcesQuery = {
  __typename?: "Query";
  org?: {
    __typename?: "Org";
    id: string;
    sites: Array<{
      __typename?: "Site";
      id: number;
      name: string;
      slotDataSource?: {
        __typename?: "SlotSiteDataSource";
        id: string;
        type: SlotDataSourceType;
      } | null;
    }>;
  } | null;
};

export type SiteMappingFragment = {
  __typename?: "Site";
  id: number;
  name: string;
  dataFeedMapping?: {
    __typename?: "FeedSiteMapping";
    id: string;
    sourceSiteId?: string | null;
  } | null;
};

export type SiteDatasourceFragment = {
  __typename?: "Site";
  id: number;
  name: string;
  slotDataSource?: {
    __typename?: "SlotSiteDataSource";
    id: string;
    type: SlotDataSourceType;
  } | null;
};

export type SubscriptionPlanFragment = {
  __typename?: "SubscriptionPlan";
  id: string;
  appId?: AppId | null;
  appName?: string | null;
  isOnprem?: boolean | null;
  package?: string | null;
  billingInterval: BillingInterval;
};

export type SubscriptionCreateMutationVariables = Exact<{
  input: SubscriptionCreateInput;
}>;

export type SubscriptionCreateMutation = {
  __typename?: "Mutation";
  subscriptionCreate?: { __typename?: "AppSubscription"; id: string } | null;
};

export type SubscriptionPlansQueryVariables = Exact<{ [key: string]: never }>;

export type SubscriptionPlansQuery = {
  __typename?: "Query";
  subscriptionPlans: Array<{
    __typename?: "SubscriptionPlan";
    id: string;
    appId?: AppId | null;
    appName?: string | null;
    isOnprem?: boolean | null;
    package?: string | null;
    billingInterval: BillingInterval;
  }>;
};

export type ImpersonateUserMutationVariables = Exact<{
  userId: Scalars["String"]["input"];
  redirectUrl: Scalars["String"]["input"];
}>;

export type ImpersonateUserMutation = {
  __typename?: "Mutation";
  sudoImpersonateUser?: string | null;
};

export type DataConnectorFieldsFragment = {
  __typename?: "OdrDataConnector";
  id: string;
  name: string;
  params?: {
    __typename?: "OdrMssqlParams";
    hostname: string;
    port: number;
    database: string;
    username: string;
    tlsEnabled?: boolean | null;
  } | null;
  dataRefreshTime?: {
    __typename?: "OdrDataRefreshTime";
    hour: number;
    minute: number;
    timezone: string;
  } | null;
};

export type DataConnectorHostSitesFragment = {
  __typename?: "OdrDataConnector";
  id: string;
  hostVizSiteIds?: Array<string> | null;
};

export type DataRefreshTimeFragment = {
  __typename?: "OdrDataRefreshTime";
  hour: number;
  minute: number;
  timezone: string;
};

export type OdrDataConnectorCreateMutationVariables = Exact<{
  input: OdrDataConnectorCreateInput;
}>;

export type OdrDataConnectorCreateMutation = {
  __typename?: "Mutation";
  odrDataConnectorCreate?: {
    __typename?: "OdrDataConnector";
    id: string;
    name: string;
    params?: {
      __typename?: "OdrMssqlParams";
      hostname: string;
      port: number;
      database: string;
      username: string;
      tlsEnabled?: boolean | null;
    } | null;
    dataRefreshTime?: {
      __typename?: "OdrDataRefreshTime";
      hour: number;
      minute: number;
      timezone: string;
    } | null;
  } | null;
};

export type OdrDataConnectorUpdateMutationVariables = Exact<{
  input: OdrDataConnectorUpdateInput;
}>;

export type OdrDataConnectorUpdateMutation = {
  __typename?: "Mutation";
  odrDataConnectorUpdate?: {
    __typename?: "OdrDataConnector";
    id: string;
    name: string;
    params?: {
      __typename?: "OdrMssqlParams";
      hostname: string;
      port: number;
      database: string;
      username: string;
      tlsEnabled?: boolean | null;
    } | null;
    dataRefreshTime?: {
      __typename?: "OdrDataRefreshTime";
      hour: number;
      minute: number;
      timezone: string;
    } | null;
  } | null;
};

export type OdrDataConnectorsQueryVariables = Exact<{ [key: string]: never }>;

export type OdrDataConnectorsQuery = {
  __typename?: "Query";
  odrDataConnectors?: Array<{
    __typename?: "OdrDataConnector";
    id: string;
    name: string;
    params?: {
      __typename?: "OdrMssqlParams";
      hostname: string;
      port: number;
      database: string;
      username: string;
      tlsEnabled?: boolean | null;
    } | null;
    dataRefreshTime?: {
      __typename?: "OdrDataRefreshTime";
      hour: number;
      minute: number;
      timezone: string;
    } | null;
  }> | null;
};

export type OdrDataConnectorHostSitesQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type OdrDataConnectorHostSitesQuery = {
  __typename?: "Query";
  connector?: {
    __typename?: "OdrDataConnector";
    id: string;
    hostVizSiteIds?: Array<string> | null;
  } | null;
};

export type DataSourceFieldsFragment = {
  __typename?: "OdrDataSource";
  id?: string | null;
  app?: { __typename?: "Application"; id: string; name: string } | null;
  site?: { __typename?: "Site"; name: string; id: string } | null;
  connector?: { __typename?: "OdrDataConnector"; id: string; name: string } | null;
  connectorParams?: { __typename?: "OdrHostVizParams"; siteId: string } | null;
};

export type OdrDataSourceUpdateMutationVariables = Exact<{
  input: OdrDataSourceUpdateInput;
}>;

export type OdrDataSourceUpdateMutation = {
  __typename?: "Mutation";
  odrDataSourceUpdate?: {
    __typename?: "OdrDataSource";
    id?: string | null;
    app?: { __typename?: "Application"; id: string; name: string } | null;
    site?: { __typename?: "Site"; name: string; id: string } | null;
    connector?: { __typename?: "OdrDataConnector"; id: string; name: string } | null;
    connectorParams?: { __typename?: "OdrHostVizParams"; siteId: string } | null;
  } | null;
};

export type OdrDataSourcesQueryVariables = Exact<{ [key: string]: never }>;

export type OdrDataSourcesQuery = {
  __typename?: "Query";
  odrDataSources?: Array<{
    __typename?: "OdrDataSource";
    id?: string | null;
    app?: { __typename?: "Application"; id: string; name: string } | null;
    site?: { __typename?: "Site"; name: string; id: string } | null;
    connector?: { __typename?: "OdrDataConnector"; id: string; name: string } | null;
    connectorParams?: { __typename?: "OdrHostVizParams"; siteId: string } | null;
  }> | null;
};

export type GreetRuleSpecialTriggerFragment = {
  __typename?: "PdGreetRuleSpecialTrigger";
  type: PdGreetRuleTriggerType;
  specialValue: {
    __typename?: "PdGreetRuleSpecialTriggerValue";
    includeAll: boolean;
    valuesIn?: string | (string | null)[] | number | (number | null)[] | null;
  };
};

export type GreetMetricDefinitionFragment = {
  __typename?: "PdGreetMetricDefinition";
  code: string;
  label: string;
  valueType: PdGreetMetricValueType;
};

export type GreetRuleMetricTriggerFragment = {
  __typename?: "PdGreetRuleMetricTrigger";
  operator: PdGreetRuleConditionOperator;
  metricValue: string | (string | null)[] | number | (number | null)[];
  metric?: {
    __typename?: "PdGreetMetricDefinition";
    code: string;
    label: string;
    valueType: PdGreetMetricValueType;
  } | null;
};

export type GreetRuleGroupAssignmentFragment = {
  __typename?: "PdGreetRuleGroupAssignment";
  assignmentToType?: PdGreetAssignmentType | null;
  userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
};

export type GreetRuleAssignmentFragment = {
  __typename?: "PdGreetRuleAssignment";
  id: string;
  weight: number;
  assignTo?: {
    __typename?: "PdGreetRuleGroupAssignment";
    assignmentToType?: PdGreetAssignmentType | null;
    userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
  } | null;
  overflowAssignment?: {
    __typename?: "PdGreetRuleGroupAssignment";
    assignmentToType?: PdGreetAssignmentType | null;
    userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
  } | null;
  overflowAssignment2?: {
    __typename?: "PdGreetRuleGroupAssignment";
    assignmentToType?: PdGreetAssignmentType | null;
    userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
  } | null;
};

export type GreetRuleFragment = {
  __typename?: "PdGreetRule";
  id: string;
  name: string;
  priority: number;
  isEnabled: boolean;
  isIgnoreSuppression?: boolean | null;
  site?: { __typename?: "Site"; name: string; id: string } | null;
  triggers: Array<
    | {
        __typename?: "PdGreetRuleMetricTrigger";
        operator: PdGreetRuleConditionOperator;
        metricValue: string | (string | null)[] | number | (number | null)[];
        metric?: {
          __typename?: "PdGreetMetricDefinition";
          code: string;
          label: string;
          valueType: PdGreetMetricValueType;
        } | null;
      }
    | {
        __typename?: "PdGreetRuleSpecialTrigger";
        type: PdGreetRuleTriggerType;
        specialValue: {
          __typename?: "PdGreetRuleSpecialTriggerValue";
          includeAll: boolean;
          valuesIn?: string | (string | null)[] | number | (number | null)[] | null;
        };
      }
  >;
  assignment?: {
    __typename?: "PdGreetRuleAssignment";
    id: string;
    weight: number;
    assignTo?: {
      __typename?: "PdGreetRuleGroupAssignment";
      assignmentToType?: PdGreetAssignmentType | null;
      userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
    } | null;
    overflowAssignment?: {
      __typename?: "PdGreetRuleGroupAssignment";
      assignmentToType?: PdGreetAssignmentType | null;
      userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
    } | null;
    overflowAssignment2?: {
      __typename?: "PdGreetRuleGroupAssignment";
      assignmentToType?: PdGreetAssignmentType | null;
      userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
    } | null;
  } | null;
};

export type GreetSectionFragment = { __typename?: "PdGreetSection"; section: string };

export type GreetReportConfigFragment = {
  __typename?: "PdGreetReportConfig";
  enabled: boolean;
  emailRecipients: Array<string>;
};

export type GreetSuppressionDaysFragment = {
  __typename?: "PdGreetSuppressionDays";
  coded: number;
  uncoded: number;
};

export type GreetTimeoutFragment = {
  __typename?: "PdGreetTimeout";
  hours: number;
  minutes: number;
};

export type GreetSettingsFragment = {
  __typename?: "PdGreetSettings";
  id: string;
  greetAssignByPriorityScore: boolean;
  greetShowGuestActiveActions: boolean;
  hostEnableSections: boolean;
  hostAllowSuppression: boolean;
  hostMaxAssignments: number;
  hostMaxMissedGreets: number;
  guestReportBanned: {
    __typename?: "PdGreetReportConfig";
    enabled: boolean;
    emailRecipients: Array<string>;
  };
  greetSuppressionDays: {
    __typename?: "PdGreetSuppressionDays";
    coded: number;
    uncoded: number;
  };
  greetQueueInactiveTimeout: {
    __typename?: "PdGreetTimeout";
    hours: number;
    minutes: number;
  };
  greetReassignmentTimeout: {
    __typename?: "PdGreetTimeout";
    hours: number;
    minutes: number;
  };
};

export type GreetRuleUserGroupFragment = {
  __typename?: "PdUserGroup";
  id: string;
  name: string;
  guestInteractionType?: PdGuestInteractionType | null;
};

export type GreetRulesPriorityUpdateMutationVariables = Exact<{
  ruleIds: Array<Scalars["ID"]["input"]> | Scalars["ID"]["input"];
  siteId: Scalars["ID"]["input"];
}>;

export type GreetRulesPriorityUpdateMutation = {
  __typename?: "Mutation";
  pdGreetRulesPriorityUpdate: Array<{
    __typename?: "PdGreetRule";
    id: string;
    name: string;
    priority: number;
    isEnabled: boolean;
    isIgnoreSuppression?: boolean | null;
    site?: { __typename?: "Site"; name: string; id: string } | null;
    triggers: Array<
      | {
          __typename?: "PdGreetRuleMetricTrigger";
          operator: PdGreetRuleConditionOperator;
          metricValue: string | (string | null)[] | number | (number | null)[];
          metric?: {
            __typename?: "PdGreetMetricDefinition";
            code: string;
            label: string;
            valueType: PdGreetMetricValueType;
          } | null;
        }
      | {
          __typename?: "PdGreetRuleSpecialTrigger";
          type: PdGreetRuleTriggerType;
          specialValue: {
            __typename?: "PdGreetRuleSpecialTriggerValue";
            includeAll: boolean;
            valuesIn?: string | (string | null)[] | number | (number | null)[] | null;
          };
        }
    >;
    assignment?: {
      __typename?: "PdGreetRuleAssignment";
      id: string;
      weight: number;
      assignTo?: {
        __typename?: "PdGreetRuleGroupAssignment";
        assignmentToType?: PdGreetAssignmentType | null;
        userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
      } | null;
      overflowAssignment?: {
        __typename?: "PdGreetRuleGroupAssignment";
        assignmentToType?: PdGreetAssignmentType | null;
        userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
      } | null;
      overflowAssignment2?: {
        __typename?: "PdGreetRuleGroupAssignment";
        assignmentToType?: PdGreetAssignmentType | null;
        userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
      } | null;
    } | null;
  }>;
};

export type GreetRuleCreateMutationVariables = Exact<{
  input: PdGreetRuleCreateInput;
}>;

export type GreetRuleCreateMutation = {
  __typename?: "Mutation";
  pdGreetRuleCreate: {
    __typename?: "PdGreetRule";
    id: string;
    name: string;
    priority: number;
    isEnabled: boolean;
    isIgnoreSuppression?: boolean | null;
    site?: { __typename?: "Site"; name: string; id: string } | null;
    triggers: Array<
      | {
          __typename?: "PdGreetRuleMetricTrigger";
          operator: PdGreetRuleConditionOperator;
          metricValue: string | (string | null)[] | number | (number | null)[];
          metric?: {
            __typename?: "PdGreetMetricDefinition";
            code: string;
            label: string;
            valueType: PdGreetMetricValueType;
          } | null;
        }
      | {
          __typename?: "PdGreetRuleSpecialTrigger";
          type: PdGreetRuleTriggerType;
          specialValue: {
            __typename?: "PdGreetRuleSpecialTriggerValue";
            includeAll: boolean;
            valuesIn?: string | (string | null)[] | number | (number | null)[] | null;
          };
        }
    >;
    assignment?: {
      __typename?: "PdGreetRuleAssignment";
      id: string;
      weight: number;
      assignTo?: {
        __typename?: "PdGreetRuleGroupAssignment";
        assignmentToType?: PdGreetAssignmentType | null;
        userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
      } | null;
      overflowAssignment?: {
        __typename?: "PdGreetRuleGroupAssignment";
        assignmentToType?: PdGreetAssignmentType | null;
        userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
      } | null;
      overflowAssignment2?: {
        __typename?: "PdGreetRuleGroupAssignment";
        assignmentToType?: PdGreetAssignmentType | null;
        userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
      } | null;
    } | null;
  };
};

export type PdGreetRuleUpdateMutationVariables = Exact<{
  input: PdGreetRuleUpdateInput;
}>;

export type PdGreetRuleUpdateMutation = {
  __typename?: "Mutation";
  pdGreetRuleUpdate?: {
    __typename?: "PdGreetRule";
    id: string;
    name: string;
    priority: number;
    isEnabled: boolean;
    isIgnoreSuppression?: boolean | null;
    site?: { __typename?: "Site"; name: string; id: string } | null;
    triggers: Array<
      | {
          __typename?: "PdGreetRuleMetricTrigger";
          operator: PdGreetRuleConditionOperator;
          metricValue: string | (string | null)[] | number | (number | null)[];
          metric?: {
            __typename?: "PdGreetMetricDefinition";
            code: string;
            label: string;
            valueType: PdGreetMetricValueType;
          } | null;
        }
      | {
          __typename?: "PdGreetRuleSpecialTrigger";
          type: PdGreetRuleTriggerType;
          specialValue: {
            __typename?: "PdGreetRuleSpecialTriggerValue";
            includeAll: boolean;
            valuesIn?: string | (string | null)[] | number | (number | null)[] | null;
          };
        }
    >;
    assignment?: {
      __typename?: "PdGreetRuleAssignment";
      id: string;
      weight: number;
      assignTo?: {
        __typename?: "PdGreetRuleGroupAssignment";
        assignmentToType?: PdGreetAssignmentType | null;
        userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
      } | null;
      overflowAssignment?: {
        __typename?: "PdGreetRuleGroupAssignment";
        assignmentToType?: PdGreetAssignmentType | null;
        userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
      } | null;
      overflowAssignment2?: {
        __typename?: "PdGreetRuleGroupAssignment";
        assignmentToType?: PdGreetAssignmentType | null;
        userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
      } | null;
    } | null;
  } | null;
};

export type GreetRuleDeleteMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  siteId: Scalars["ID"]["input"];
}>;

export type GreetRuleDeleteMutation = {
  __typename?: "Mutation";
  pdGreetRuleDelete?: boolean | null;
};

export type GreetSettingsUpdateMutationVariables = Exact<{
  input: PdGreetSettingsUpdateInput;
}>;

export type GreetSettingsUpdateMutation = {
  __typename?: "Mutation";
  pdGreetSettingsUpdate?: {
    __typename?: "PdGreetSettings";
    id: string;
    greetAssignByPriorityScore: boolean;
    greetShowGuestActiveActions: boolean;
    hostEnableSections: boolean;
    hostAllowSuppression: boolean;
    hostMaxAssignments: number;
    hostMaxMissedGreets: number;
    guestReportBanned: {
      __typename?: "PdGreetReportConfig";
      enabled: boolean;
      emailRecipients: Array<string>;
    };
    greetSuppressionDays: {
      __typename?: "PdGreetSuppressionDays";
      coded: number;
      uncoded: number;
    };
    greetQueueInactiveTimeout: {
      __typename?: "PdGreetTimeout";
      hours: number;
      minutes: number;
    };
    greetReassignmentTimeout: {
      __typename?: "PdGreetTimeout";
      hours: number;
      minutes: number;
    };
  } | null;
};

export type GreetRulesQueryVariables = Exact<{
  siteId: Scalars["ID"]["input"];
}>;

export type GreetRulesQuery = {
  __typename?: "Query";
  pdGreetRules: Array<{
    __typename?: "PdGreetRule";
    id: string;
    name: string;
    priority: number;
    isEnabled: boolean;
    isIgnoreSuppression?: boolean | null;
    site?: { __typename?: "Site"; name: string; id: string } | null;
    triggers: Array<
      | {
          __typename?: "PdGreetRuleMetricTrigger";
          operator: PdGreetRuleConditionOperator;
          metricValue: string | (string | null)[] | number | (number | null)[];
          metric?: {
            __typename?: "PdGreetMetricDefinition";
            code: string;
            label: string;
            valueType: PdGreetMetricValueType;
          } | null;
        }
      | {
          __typename?: "PdGreetRuleSpecialTrigger";
          type: PdGreetRuleTriggerType;
          specialValue: {
            __typename?: "PdGreetRuleSpecialTriggerValue";
            includeAll: boolean;
            valuesIn?: string | (string | null)[] | number | (number | null)[] | null;
          };
        }
    >;
    assignment?: {
      __typename?: "PdGreetRuleAssignment";
      id: string;
      weight: number;
      assignTo?: {
        __typename?: "PdGreetRuleGroupAssignment";
        assignmentToType?: PdGreetAssignmentType | null;
        userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
      } | null;
      overflowAssignment?: {
        __typename?: "PdGreetRuleGroupAssignment";
        assignmentToType?: PdGreetAssignmentType | null;
        userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
      } | null;
      overflowAssignment2?: {
        __typename?: "PdGreetRuleGroupAssignment";
        assignmentToType?: PdGreetAssignmentType | null;
        userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
      } | null;
    } | null;
  }>;
};

export type GreetSectionsQueryVariables = Exact<{
  siteId: Scalars["ID"]["input"];
}>;

export type GreetSectionsQuery = {
  __typename?: "Query";
  pdGreetSections: Array<{ __typename?: "PdGreetSection"; section: string }>;
};

export type GreetRuleBuilderOrgDataQueryVariables = Exact<{ [key: string]: never }>;

export type GreetRuleBuilderOrgDataQuery = {
  __typename?: "Query";
  pdOrgSettings?: {
    __typename?: "PdOrgSettings";
    id: string;
    tiers: Array<{
      __typename?: "PdTier";
      id: string;
      name: string;
      order: number;
      color?: any | null;
    }>;
  } | null;
  pdGreetMetrics: Array<{
    __typename?: "PdGreetMetricDefinition";
    code: string;
    label: string;
    valueType: PdGreetMetricValueType;
  }>;
  pdUserGroups: Array<{
    __typename?: "PdUserGroup";
    id: string;
    name: string;
    guestInteractionType?: PdGuestInteractionType | null;
  }>;
};

export type GreetRuleBuilderSiteDataQueryVariables = Exact<{
  siteId: Scalars["ID"]["input"];
}>;

export type GreetRuleBuilderSiteDataQuery = {
  __typename?: "Query";
  pdGreetRules: Array<{
    __typename?: "PdGreetRule";
    id: string;
    name: string;
    priority: number;
    isEnabled: boolean;
    isIgnoreSuppression?: boolean | null;
    site?: { __typename?: "Site"; name: string; id: string } | null;
    triggers: Array<
      | {
          __typename?: "PdGreetRuleMetricTrigger";
          operator: PdGreetRuleConditionOperator;
          metricValue: string | (string | null)[] | number | (number | null)[];
          metric?: {
            __typename?: "PdGreetMetricDefinition";
            code: string;
            label: string;
            valueType: PdGreetMetricValueType;
          } | null;
        }
      | {
          __typename?: "PdGreetRuleSpecialTrigger";
          type: PdGreetRuleTriggerType;
          specialValue: {
            __typename?: "PdGreetRuleSpecialTriggerValue";
            includeAll: boolean;
            valuesIn?: string | (string | null)[] | number | (number | null)[] | null;
          };
        }
    >;
    assignment?: {
      __typename?: "PdGreetRuleAssignment";
      id: string;
      weight: number;
      assignTo?: {
        __typename?: "PdGreetRuleGroupAssignment";
        assignmentToType?: PdGreetAssignmentType | null;
        userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
      } | null;
      overflowAssignment?: {
        __typename?: "PdGreetRuleGroupAssignment";
        assignmentToType?: PdGreetAssignmentType | null;
        userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
      } | null;
      overflowAssignment2?: {
        __typename?: "PdGreetRuleGroupAssignment";
        assignmentToType?: PdGreetAssignmentType | null;
        userGroup?: { __typename?: "PdUserGroup"; id: string; name: string } | null;
      } | null;
    } | null;
  }>;
  pdGreetSections: Array<{ __typename?: "PdGreetSection"; section: string }>;
};

export type GreetSettingsQueryVariables = Exact<{ [key: string]: never }>;

export type GreetSettingsQuery = {
  __typename?: "Query";
  pdGreetSettings?: {
    __typename?: "PdGreetSettings";
    id: string;
    greetAssignByPriorityScore: boolean;
    greetShowGuestActiveActions: boolean;
    hostEnableSections: boolean;
    hostAllowSuppression: boolean;
    hostMaxAssignments: number;
    hostMaxMissedGreets: number;
    guestReportBanned: {
      __typename?: "PdGreetReportConfig";
      enabled: boolean;
      emailRecipients: Array<string>;
    };
    greetSuppressionDays: {
      __typename?: "PdGreetSuppressionDays";
      coded: number;
      uncoded: number;
    };
    greetQueueInactiveTimeout: {
      __typename?: "PdGreetTimeout";
      hours: number;
      minutes: number;
    };
    greetReassignmentTimeout: {
      __typename?: "PdGreetTimeout";
      hours: number;
      minutes: number;
    };
  } | null;
};

export type LoyaltyTierFragment = {
  __typename?: "PdTier";
  id: string;
  name: string;
  order: number;
  color?: any | null;
};

export type GaCompanyFragment = {
  __typename?: "Company";
  id: string;
  name: string;
  email: string;
  address: {
    __typename?: "Address";
    phone: string;
    country: string;
    region: string;
    city: string;
    street1: string;
    street2: string;
    postalCode: string;
  };
};

export type GaCompanyAddressFragment = {
  __typename?: "Company";
  id: string;
  address: {
    __typename?: "Address";
    phone: string;
    country: string;
    region: string;
    city: string;
    street1: string;
    street2: string;
    postalCode: string;
  };
};

export type CompanyUpdateOutputFragment = {
  __typename?: "Company";
  id: string;
  name: string;
  email: string;
  address: {
    __typename?: "Address";
    phone: string;
    country: string;
    region: string;
    city: string;
    street1: string;
    street2: string;
    postalCode: string;
  };
};

export type OrgLoyaltyTiersUpdateMutationVariables = Exact<{
  input?: InputMaybe<Array<PdTierInput> | PdTierInput>;
}>;

export type OrgLoyaltyTiersUpdateMutation = {
  __typename?: "Mutation";
  pdOrgSettingsUpdate?: {
    __typename?: "PdOrgSettings";
    id: string;
    tiers: Array<{
      __typename?: "PdTier";
      id: string;
      name: string;
      order: number;
      color?: any | null;
    }>;
  } | null;
};

export type CompanyUpdateMutationVariables = Exact<{
  input: CompanyInput;
}>;

export type CompanyUpdateMutation = {
  __typename?: "Mutation";
  companyUpdate?: {
    __typename?: "Company";
    id: string;
    name: string;
    email: string;
    address: {
      __typename?: "Address";
      phone: string;
      country: string;
      region: string;
      city: string;
      street1: string;
      street2: string;
      postalCode: string;
    };
  } | null;
};

export type CurrentOrgFeaturesQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentOrgFeaturesQuery = {
  __typename?: "Query";
  currentOrg?: {
    __typename?: "Org";
    id: string;
    features: { __typename?: "OrgFeatures"; multiProperties: boolean };
  } | null;
};

export type OrgLoyaltyTiersQueryVariables = Exact<{ [key: string]: never }>;

export type OrgLoyaltyTiersQuery = {
  __typename?: "Query";
  pdOrgSettings?: {
    __typename?: "PdOrgSettings";
    id: string;
    tiers: Array<{
      __typename?: "PdTier";
      id: string;
      name: string;
      order: number;
      color?: any | null;
    }>;
  } | null;
};

export type CompanyQueryVariables = Exact<{ [key: string]: never }>;

export type CompanyQuery = {
  __typename?: "Query";
  currentOrg?: {
    __typename?: "Org";
    id: string;
    company?: {
      __typename?: "Company";
      id: string;
      name: string;
      email: string;
      address: {
        __typename?: "Address";
        phone: string;
        country: string;
        region: string;
        city: string;
        street1: string;
        street2: string;
        postalCode: string;
      };
    } | null;
  } | null;
};

export type PdreRuleFragment = {
  __typename?: "PdRule";
  id: string;
  code: string;
  siteId?: string | null;
  name: string;
  description: string;
  config?: {
    __typename?: "PdRuleConfig";
    id: string;
    enabled: boolean;
    weight: number;
  } | null;
};

export type PdreRuleConfigUpdateMutationVariables = Exact<{
  input: PdRuleConfigUpdateInput;
}>;

export type PdreRuleConfigUpdateMutation = {
  __typename?: "Mutation";
  pdreRuleConfigUpdate: {
    __typename?: "PdRuleConfig";
    id: string;
    enabled: boolean;
    weight: number;
  };
};

export type PdreRulesQueryVariables = Exact<{
  siteId: Scalars["ID"]["input"];
}>;

export type PdreRulesQuery = {
  __typename?: "Query";
  pdreRules: Array<{
    __typename?: "PdRule";
    id: string;
    code: string;
    siteId?: string | null;
    name: string;
    description: string;
    config?: {
      __typename?: "PdRuleConfig";
      id: string;
      enabled: boolean;
      weight: number;
    } | null;
  }>;
};

export type PdreSettingsFragment = {
  __typename?: "PdOrgSettings";
  valueMetric: PdValueMetric;
  lookbackDays: number;
  maxTasksPerHost: number;
  maxTasksPerView: number;
  taskScheduler: {
    __typename?: "PdSchedulerRunTime";
    id: string;
    hour: number;
    minute: number;
    timezone: string;
  };
};

export type UpdatePdreSettingsMutationVariables = Exact<{
  input: PdOrgSettingsInput;
}>;

export type UpdatePdreSettingsMutation = {
  __typename?: "Mutation";
  pdOrgSettingsUpdate?: {
    __typename?: "PdOrgSettings";
    id: string;
    valueMetric: PdValueMetric;
    lookbackDays: number;
    maxTasksPerHost: number;
    maxTasksPerView: number;
    taskScheduler: {
      __typename?: "PdSchedulerRunTime";
      id: string;
      hour: number;
      minute: number;
      timezone: string;
    };
  } | null;
};

export type PdreSettingsQueryVariables = Exact<{ [key: string]: never }>;

export type PdreSettingsQuery = {
  __typename?: "Query";
  settings?: {
    __typename?: "PdOrgSettings";
    id: string;
    valueMetric: PdValueMetric;
    lookbackDays: number;
    maxTasksPerHost: number;
    maxTasksPerView: number;
    taskScheduler: {
      __typename?: "PdSchedulerRunTime";
      id: string;
      hour: number;
      minute: number;
      timezone: string;
    };
  } | null;
};

export type SiteFragment = {
  __typename?: "Site";
  name: string;
  tz?: any | null;
  id: string;
  currency?: { __typename?: "Currency"; code?: any | null } | null;
};

export type CreateSiteMutationVariables = Exact<{
  input: SiteCreateInput;
}>;

export type CreateSiteMutation = {
  __typename?: "Mutation";
  siteCreateV2?: {
    __typename?: "Site";
    name: string;
    tz?: any | null;
    id: string;
    currency?: { __typename?: "Currency"; code?: any | null } | null;
  } | null;
};

export type UpdateSiteMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  site: SiteUpdate;
}>;

export type UpdateSiteMutation = {
  __typename?: "Mutation";
  siteUpdate?: {
    __typename?: "Site";
    name: string;
    tz?: any | null;
    id: string;
    currency?: { __typename?: "Currency"; code?: any | null } | null;
  } | null;
};

export type DeleteSiteMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type DeleteSiteMutation = { __typename?: "Mutation"; siteDelete?: boolean | null };

export type GetSitesQueryVariables = Exact<{ [key: string]: never }>;

export type GetSitesQuery = {
  __typename?: "Query";
  sites?: Array<{
    __typename?: "Site";
    name: string;
    tz?: any | null;
    id: string;
    currency?: { __typename?: "Currency"; code?: any | null } | null;
  }> | null;
};

export type NativeHostIdsForSiteQueryVariables = Exact<{
  siteId: Scalars["Int"]["input"];
}>;

export type NativeHostIdsForSiteQuery = {
  __typename?: "Query";
  site?: {
    __typename?: "Site";
    name: string;
    pdNativeHostIds?: Array<string> | null;
    id: string;
  } | null;
};

export type AppSubscriptionFragment = {
  __typename?: "Application";
  id: string;
  name: string;
  subscription?: {
    __typename?: "AppSubscription";
    id: string;
    isOnprem?: boolean | null;
    package?: string | null;
    periodStartDate?: any | null;
    periodEndDate?: any | null;
    status?: SubscriptionStatus | null;
    isValid?: boolean | null;
  } | null;
};

export type SubscriptionFragment = {
  __typename?: "AppSubscription";
  id: string;
  isOnprem?: boolean | null;
  package?: string | null;
  periodStartDate?: any | null;
  periodEndDate?: any | null;
  status?: SubscriptionStatus | null;
  isValid?: boolean | null;
};

export type ApplicationSubscriptionsQueryVariables = Exact<{ [key: string]: never }>;

export type ApplicationSubscriptionsQuery = {
  __typename?: "Query";
  appSubscriptions: Array<{
    __typename?: "Application";
    id: string;
    name: string;
    subscription?: {
      __typename?: "AppSubscription";
      id: string;
      isOnprem?: boolean | null;
      package?: string | null;
      periodStartDate?: any | null;
      periodEndDate?: any | null;
      status?: SubscriptionStatus | null;
      isValid?: boolean | null;
    } | null;
  }>;
};

export type GaUserFieldsFragment = {
  __typename?: "User";
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type GaAccessListFragment = {
  __typename?: "UserAppAccess";
  app: { __typename?: "Application"; id: string; name: string };
  role: { __typename?: "AppRole"; id: string; name: string };
  site: { __typename?: "Site"; name: string; id: string };
};

export type GaUserFragment = {
  __typename?: "User";
  accessLevel: OrgAccessLevel;
  mfa?: boolean | null;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  accessList: Array<{
    __typename?: "UserAppAccess";
    app: { __typename?: "Application"; id: string; name: string };
    role: { __typename?: "AppRole"; id: string; name: string };
    site: { __typename?: "Site"; name: string; id: string };
  }>;
};

export type GaCurrentUserMfaFragment = {
  __typename?: "User";
  id: string;
  mfa?: boolean | null;
};

export type UserProfileUpdateMutationVariables = Exact<{
  user: UserProfileInput;
}>;

export type UserProfileUpdateMutation = {
  __typename?: "Mutation";
  userProfileUpdate?: {
    __typename?: "User";
    accessLevel: OrgAccessLevel;
    mfa?: boolean | null;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    accessList: Array<{
      __typename?: "UserAppAccess";
      app: { __typename?: "Application"; id: string; name: string };
      role: { __typename?: "AppRole"; id: string; name: string };
      site: { __typename?: "Site"; name: string; id: string };
    }>;
  } | null;
};

export type UserPasswordResetMutationVariables = Exact<{
  user: UserPasswordResetInput;
}>;

export type UserPasswordResetMutation = {
  __typename?: "Mutation";
  userPasswordReset?: boolean | null;
};

export type EmailExistsQueryVariables = Exact<{
  email: Scalars["String"]["input"];
}>;

export type EmailExistsQuery = { __typename?: "Query"; emailExists: boolean };

export type CurrentUserMfaQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentUserMfaQuery = {
  __typename?: "Query";
  currentUser?: { __typename?: "User"; id: string; mfa?: boolean | null } | null;
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentUserQuery = {
  __typename?: "Query";
  currentUser?: {
    __typename?: "User";
    accessLevel: OrgAccessLevel;
    mfa?: boolean | null;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    accessList: Array<{
      __typename?: "UserAppAccess";
      app: { __typename?: "Application"; id: string; name: string };
      role: { __typename?: "AppRole"; id: string; name: string };
      site: { __typename?: "Site"; name: string; id: string };
    }>;
  } | null;
};

export const HeatMapInventoryFragmentDoc = gql`
  fragment HeatMapInventory on HeatMap {
    id
    uploadedAt
    attributes
  }
`;
export const OrgHeatMapFragmentDoc = gql`
  fragment OrgHeatMap on OrgHeatMap {
    id
    floorId
    sourceSiteId
    effectiveFrom
    heatMapId
  }
`;
export const OrgLicenseFragmentDoc = gql`
  fragment OrgLicense on OrgLicense {
    id
    key
    issuedAt
    expiresAt
    lastVerifiedAt
    lastVerifiedVersions {
      app
      sisenseDataObject
    }
  }
`;
export const OrgSummaryFragmentDoc = gql`
  fragment OrgSummary on Org {
    id
    company {
      id
      name
      email
    }
  }
`;
export const SiteMappingFragmentDoc = gql`
  fragment SiteMapping on Site {
    id
    name
    dataFeedMapping {
      id
      sourceSiteId
    }
  }
`;
export const SiteDatasourceFragmentDoc = gql`
  fragment SiteDatasource on Site {
    id
    name
    slotDataSource {
      id
      type
    }
  }
`;
export const SubscriptionPlanFragmentDoc = gql`
  fragment SubscriptionPlan on SubscriptionPlan {
    id
    appId
    appName
    isOnprem
    package
    billingInterval
  }
`;
export const DataRefreshTimeFragmentDoc = gql`
  fragment DataRefreshTime on OdrDataRefreshTime {
    hour
    minute
    timezone
  }
`;
export const DataConnectorFieldsFragmentDoc = gql`
  fragment DataConnectorFields on OdrDataConnector {
    id
    name
    params {
      ... on OdrMssqlParams {
        hostname
        port
        database
        username
        tlsEnabled
      }
    }
    dataRefreshTime {
      ...DataRefreshTime
    }
  }
  ${DataRefreshTimeFragmentDoc}
`;
export const DataConnectorHostSitesFragmentDoc = gql`
  fragment DataConnectorHostSites on OdrDataConnector {
    id
    hostVizSiteIds
  }
`;
export const DataSourceFieldsFragmentDoc = gql`
  fragment DataSourceFields on OdrDataSource {
    id
    app {
      id
      name
    }
    site {
      id: idV2
      name
    }
    connector {
      id
      name
    }
    connectorParams {
      ... on OdrHostVizParams {
        siteId
      }
    }
  }
`;
export const GreetRuleSpecialTriggerFragmentDoc = gql`
  fragment GreetRuleSpecialTrigger on PdGreetRuleSpecialTrigger {
    type
    specialValue: value {
      includeAll
      valuesIn
    }
  }
`;
export const GreetMetricDefinitionFragmentDoc = gql`
  fragment GreetMetricDefinition on PdGreetMetricDefinition {
    code
    label
    valueType
  }
`;
export const GreetRuleMetricTriggerFragmentDoc = gql`
  fragment GreetRuleMetricTrigger on PdGreetRuleMetricTrigger {
    metric {
      ...GreetMetricDefinition
    }
    metricValue: value
    operator
  }
  ${GreetMetricDefinitionFragmentDoc}
`;
export const GreetRuleGroupAssignmentFragmentDoc = gql`
  fragment GreetRuleGroupAssignment on PdGreetRuleGroupAssignment {
    assignmentToType
    userGroup {
      id
      name
    }
  }
`;
export const GreetRuleAssignmentFragmentDoc = gql`
  fragment GreetRuleAssignment on PdGreetRuleAssignment {
    id
    weight
    assignTo {
      ...GreetRuleGroupAssignment
    }
    overflowAssignment {
      ...GreetRuleGroupAssignment
    }
    overflowAssignment2 {
      ...GreetRuleGroupAssignment
    }
  }
  ${GreetRuleGroupAssignmentFragmentDoc}
`;
export const GreetRuleFragmentDoc = gql`
  fragment GreetRule on PdGreetRule {
    id
    name
    priority
    isEnabled
    isIgnoreSuppression
    site {
      id: idV2
      name
    }
    triggers {
      ... on PdGreetRuleSpecialTrigger {
        ...GreetRuleSpecialTrigger
      }
      ... on PdGreetRuleMetricTrigger {
        ...GreetRuleMetricTrigger
      }
    }
    assignment {
      ...GreetRuleAssignment
    }
  }
  ${GreetRuleSpecialTriggerFragmentDoc}
  ${GreetRuleMetricTriggerFragmentDoc}
  ${GreetRuleAssignmentFragmentDoc}
`;
export const GreetSectionFragmentDoc = gql`
  fragment GreetSection on PdGreetSection {
    section
  }
`;
export const GreetReportConfigFragmentDoc = gql`
  fragment GreetReportConfig on PdGreetReportConfig {
    enabled
    emailRecipients
  }
`;
export const GreetSuppressionDaysFragmentDoc = gql`
  fragment GreetSuppressionDays on PdGreetSuppressionDays {
    coded
    uncoded
  }
`;
export const GreetTimeoutFragmentDoc = gql`
  fragment GreetTimeout on PdGreetTimeout {
    hours
    minutes
  }
`;
export const GreetSettingsFragmentDoc = gql`
  fragment GreetSettings on PdGreetSettings {
    id
    guestReportBanned {
      ...GreetReportConfig
    }
    greetSuppressionDays {
      ...GreetSuppressionDays
    }
    greetQueueInactiveTimeout {
      ...GreetTimeout
    }
    greetReassignmentTimeout {
      ...GreetTimeout
    }
    greetAssignByPriorityScore
    greetShowGuestActiveActions
    hostEnableSections
    hostAllowSuppression
    hostMaxAssignments
    hostMaxMissedGreets
  }
  ${GreetReportConfigFragmentDoc}
  ${GreetSuppressionDaysFragmentDoc}
  ${GreetTimeoutFragmentDoc}
`;
export const GreetRuleUserGroupFragmentDoc = gql`
  fragment GreetRuleUserGroup on PdUserGroup {
    id
    name
    guestInteractionType
  }
`;
export const LoyaltyTierFragmentDoc = gql`
  fragment LoyaltyTier on PdTier {
    id
    name
    order
    color: cssColor
  }
`;
export const GaCompanyAddressFragmentDoc = gql`
  fragment GaCompanyAddress on Company {
    id
    address {
      phone
      country
      region
      city
      street1
      street2
      postalCode
    }
  }
`;
export const GaCompanyFragmentDoc = gql`
  fragment GaCompany on Company {
    id
    name
    email
    ...GaCompanyAddress
  }
  ${GaCompanyAddressFragmentDoc}
`;
export const CompanyUpdateOutputFragmentDoc = gql`
  fragment CompanyUpdateOutput on Company {
    id
    name
    email
    ...GaCompanyAddress
  }
  ${GaCompanyAddressFragmentDoc}
`;
export const PdreRuleFragmentDoc = gql`
  fragment PdreRule on PdRule {
    id
    code
    siteId
    name
    description
    config {
      id
      enabled
      weight
    }
  }
`;
export const PdreSettingsFragmentDoc = gql`
  fragment PdreSettings on PdOrgSettings {
    valueMetric
    lookbackDays
    maxTasksPerHost
    maxTasksPerView
    taskScheduler {
      id
      hour
      minute
      timezone
    }
  }
`;
export const SiteFragmentDoc = gql`
  fragment Site on Site {
    id: idV2
    name
    currency {
      code
    }
    tz
  }
`;
export const SubscriptionFragmentDoc = gql`
  fragment Subscription on AppSubscription {
    id
    isOnprem
    package
    periodStartDate
    periodEndDate
    status
    isValid
  }
`;
export const AppSubscriptionFragmentDoc = gql`
  fragment AppSubscription on Application {
    id
    name
    subscription {
      ...Subscription
    }
  }
  ${SubscriptionFragmentDoc}
`;
export const GaUserFieldsFragmentDoc = gql`
  fragment GaUserFields on User {
    id
    firstName
    lastName
    email
    phone
  }
`;
export const GaAccessListFragmentDoc = gql`
  fragment GaAccessList on UserAppAccess {
    app {
      id
      name
    }
    role {
      id
      name
    }
    site {
      id: idV2
      name
    }
  }
`;
export const GaUserFragmentDoc = gql`
  fragment GaUser on User {
    ...GaUserFields
    accessLevel
    accessList {
      ...GaAccessList
    }
    mfa
  }
  ${GaUserFieldsFragmentDoc}
  ${GaAccessListFragmentDoc}
`;
export const GaCurrentUserMfaFragmentDoc = gql`
  fragment GaCurrentUserMfa on User {
    id
    mfa
  }
`;
export const DataFeedStatusDocument = gql`
  query dataFeedStatus {
    dataFeedStatus {
      maxDate
    }
  }
`;

/**
 * __useDataFeedStatusQuery__
 *
 * To run a query within a React component, call `useDataFeedStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useDataFeedStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDataFeedStatusQuery({
 *   variables: {
 *   },
 * });
 */
export function useDataFeedStatusQuery(
  baseOptions?: Apollo.QueryHookOptions<DataFeedStatusQuery, DataFeedStatusQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DataFeedStatusQuery, DataFeedStatusQueryVariables>(
    DataFeedStatusDocument,
    options
  );
}
export function useDataFeedStatusLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DataFeedStatusQuery,
    DataFeedStatusQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DataFeedStatusQuery, DataFeedStatusQueryVariables>(
    DataFeedStatusDocument,
    options
  );
}
export function useDataFeedStatusSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    DataFeedStatusQuery,
    DataFeedStatusQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<DataFeedStatusQuery, DataFeedStatusQueryVariables>(
    DataFeedStatusDocument,
    options
  );
}
export type DataFeedStatusQueryHookResult = ReturnType<typeof useDataFeedStatusQuery>;
export type DataFeedStatusLazyQueryHookResult = ReturnType<
  typeof useDataFeedStatusLazyQuery
>;
export type DataFeedStatusSuspenseQueryHookResult = ReturnType<
  typeof useDataFeedStatusSuspenseQuery
>;
export type DataFeedStatusQueryResult = Apollo.QueryResult<
  DataFeedStatusQuery,
  DataFeedStatusQueryVariables
>;
export const DataFeedSourceSiteIdsDocument = gql`
  query dataFeedSourceSiteIds {
    dataFeedStatus {
      sourceSiteIds
    }
  }
`;

/**
 * __useDataFeedSourceSiteIdsQuery__
 *
 * To run a query within a React component, call `useDataFeedSourceSiteIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDataFeedSourceSiteIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDataFeedSourceSiteIdsQuery({
 *   variables: {
 *   },
 * });
 */
export function useDataFeedSourceSiteIdsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    DataFeedSourceSiteIdsQuery,
    DataFeedSourceSiteIdsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DataFeedSourceSiteIdsQuery, DataFeedSourceSiteIdsQueryVariables>(
    DataFeedSourceSiteIdsDocument,
    options
  );
}
export function useDataFeedSourceSiteIdsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DataFeedSourceSiteIdsQuery,
    DataFeedSourceSiteIdsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    DataFeedSourceSiteIdsQuery,
    DataFeedSourceSiteIdsQueryVariables
  >(DataFeedSourceSiteIdsDocument, options);
}
export function useDataFeedSourceSiteIdsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    DataFeedSourceSiteIdsQuery,
    DataFeedSourceSiteIdsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    DataFeedSourceSiteIdsQuery,
    DataFeedSourceSiteIdsQueryVariables
  >(DataFeedSourceSiteIdsDocument, options);
}
export type DataFeedSourceSiteIdsQueryHookResult = ReturnType<
  typeof useDataFeedSourceSiteIdsQuery
>;
export type DataFeedSourceSiteIdsLazyQueryHookResult = ReturnType<
  typeof useDataFeedSourceSiteIdsLazyQuery
>;
export type DataFeedSourceSiteIdsSuspenseQueryHookResult = ReturnType<
  typeof useDataFeedSourceSiteIdsSuspenseQuery
>;
export type DataFeedSourceSiteIdsQueryResult = Apollo.QueryResult<
  DataFeedSourceSiteIdsQuery,
  DataFeedSourceSiteIdsQueryVariables
>;
export const HeatmapAssociateDocument = gql`
  mutation heatmapAssociate($input: OrgHeatMapCreateInput!) {
    orgHeatmapAdd(input: $input) {
      ...OrgHeatMap
    }
  }
  ${OrgHeatMapFragmentDoc}
`;
export type HeatmapAssociateMutationFn = Apollo.MutationFunction<
  HeatmapAssociateMutation,
  HeatmapAssociateMutationVariables
>;

/**
 * __useHeatmapAssociateMutation__
 *
 * To run a mutation, you first call `useHeatmapAssociateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHeatmapAssociateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [heatmapAssociateMutation, { data, loading, error }] = useHeatmapAssociateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useHeatmapAssociateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    HeatmapAssociateMutation,
    HeatmapAssociateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<HeatmapAssociateMutation, HeatmapAssociateMutationVariables>(
    HeatmapAssociateDocument,
    options
  );
}
export type HeatmapAssociateMutationHookResult = ReturnType<
  typeof useHeatmapAssociateMutation
>;
export type HeatmapAssociateMutationResult =
  Apollo.MutationResult<HeatmapAssociateMutation>;
export type HeatmapAssociateMutationOptions = Apollo.BaseMutationOptions<
  HeatmapAssociateMutation,
  HeatmapAssociateMutationVariables
>;
export const HeatmapDeleteAssociationDocument = gql`
  mutation heatmapDeleteAssociation($id: ID!) {
    orgHeatmapDelete(id: $id)
  }
`;
export type HeatmapDeleteAssociationMutationFn = Apollo.MutationFunction<
  HeatmapDeleteAssociationMutation,
  HeatmapDeleteAssociationMutationVariables
>;

/**
 * __useHeatmapDeleteAssociationMutation__
 *
 * To run a mutation, you first call `useHeatmapDeleteAssociationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHeatmapDeleteAssociationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [heatmapDeleteAssociationMutation, { data, loading, error }] = useHeatmapDeleteAssociationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useHeatmapDeleteAssociationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    HeatmapDeleteAssociationMutation,
    HeatmapDeleteAssociationMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    HeatmapDeleteAssociationMutation,
    HeatmapDeleteAssociationMutationVariables
  >(HeatmapDeleteAssociationDocument, options);
}
export type HeatmapDeleteAssociationMutationHookResult = ReturnType<
  typeof useHeatmapDeleteAssociationMutation
>;
export type HeatmapDeleteAssociationMutationResult =
  Apollo.MutationResult<HeatmapDeleteAssociationMutation>;
export type HeatmapDeleteAssociationMutationOptions = Apollo.BaseMutationOptions<
  HeatmapDeleteAssociationMutation,
  HeatmapDeleteAssociationMutationVariables
>;
export const HeatMapInventoryDocument = gql`
  query heatMapInventory($siteId: ID!) {
    heatMapInventory(siteId: $siteId) {
      ...HeatMapInventory
    }
  }
  ${HeatMapInventoryFragmentDoc}
`;

/**
 * __useHeatMapInventoryQuery__
 *
 * To run a query within a React component, call `useHeatMapInventoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useHeatMapInventoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHeatMapInventoryQuery({
 *   variables: {
 *      siteId: // value for 'siteId'
 *   },
 * });
 */
export function useHeatMapInventoryQuery(
  baseOptions: Apollo.QueryHookOptions<
    HeatMapInventoryQuery,
    HeatMapInventoryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<HeatMapInventoryQuery, HeatMapInventoryQueryVariables>(
    HeatMapInventoryDocument,
    options
  );
}
export function useHeatMapInventoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    HeatMapInventoryQuery,
    HeatMapInventoryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<HeatMapInventoryQuery, HeatMapInventoryQueryVariables>(
    HeatMapInventoryDocument,
    options
  );
}
export function useHeatMapInventorySuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    HeatMapInventoryQuery,
    HeatMapInventoryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<HeatMapInventoryQuery, HeatMapInventoryQueryVariables>(
    HeatMapInventoryDocument,
    options
  );
}
export type HeatMapInventoryQueryHookResult = ReturnType<typeof useHeatMapInventoryQuery>;
export type HeatMapInventoryLazyQueryHookResult = ReturnType<
  typeof useHeatMapInventoryLazyQuery
>;
export type HeatMapInventorySuspenseQueryHookResult = ReturnType<
  typeof useHeatMapInventorySuspenseQuery
>;
export type HeatMapInventoryQueryResult = Apollo.QueryResult<
  HeatMapInventoryQuery,
  HeatMapInventoryQueryVariables
>;
export const HeatMapInventorySearchDocument = gql`
  query heatMapInventorySearch($keyword: String!) {
    heatMapInventorySearch(keyword: $keyword) {
      ...HeatMapInventory
    }
  }
  ${HeatMapInventoryFragmentDoc}
`;

/**
 * __useHeatMapInventorySearchQuery__
 *
 * To run a query within a React component, call `useHeatMapInventorySearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useHeatMapInventorySearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHeatMapInventorySearchQuery({
 *   variables: {
 *      keyword: // value for 'keyword'
 *   },
 * });
 */
export function useHeatMapInventorySearchQuery(
  baseOptions: Apollo.QueryHookOptions<
    HeatMapInventorySearchQuery,
    HeatMapInventorySearchQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    HeatMapInventorySearchQuery,
    HeatMapInventorySearchQueryVariables
  >(HeatMapInventorySearchDocument, options);
}
export function useHeatMapInventorySearchLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    HeatMapInventorySearchQuery,
    HeatMapInventorySearchQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    HeatMapInventorySearchQuery,
    HeatMapInventorySearchQueryVariables
  >(HeatMapInventorySearchDocument, options);
}
export function useHeatMapInventorySearchSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    HeatMapInventorySearchQuery,
    HeatMapInventorySearchQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    HeatMapInventorySearchQuery,
    HeatMapInventorySearchQueryVariables
  >(HeatMapInventorySearchDocument, options);
}
export type HeatMapInventorySearchQueryHookResult = ReturnType<
  typeof useHeatMapInventorySearchQuery
>;
export type HeatMapInventorySearchLazyQueryHookResult = ReturnType<
  typeof useHeatMapInventorySearchLazyQuery
>;
export type HeatMapInventorySearchSuspenseQueryHookResult = ReturnType<
  typeof useHeatMapInventorySearchSuspenseQuery
>;
export type HeatMapInventorySearchQueryResult = Apollo.QueryResult<
  HeatMapInventorySearchQuery,
  HeatMapInventorySearchQueryVariables
>;
export const OrgHeatmapsDocument = gql`
  query orgHeatmaps {
    orgHeatMaps {
      ...OrgHeatMap
    }
  }
  ${OrgHeatMapFragmentDoc}
`;

/**
 * __useOrgHeatmapsQuery__
 *
 * To run a query within a React component, call `useOrgHeatmapsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrgHeatmapsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrgHeatmapsQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrgHeatmapsQuery(
  baseOptions?: Apollo.QueryHookOptions<OrgHeatmapsQuery, OrgHeatmapsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<OrgHeatmapsQuery, OrgHeatmapsQueryVariables>(
    OrgHeatmapsDocument,
    options
  );
}
export function useOrgHeatmapsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<OrgHeatmapsQuery, OrgHeatmapsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<OrgHeatmapsQuery, OrgHeatmapsQueryVariables>(
    OrgHeatmapsDocument,
    options
  );
}
export function useOrgHeatmapsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    OrgHeatmapsQuery,
    OrgHeatmapsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<OrgHeatmapsQuery, OrgHeatmapsQueryVariables>(
    OrgHeatmapsDocument,
    options
  );
}
export type OrgHeatmapsQueryHookResult = ReturnType<typeof useOrgHeatmapsQuery>;
export type OrgHeatmapsLazyQueryHookResult = ReturnType<typeof useOrgHeatmapsLazyQuery>;
export type OrgHeatmapsSuspenseQueryHookResult = ReturnType<
  typeof useOrgHeatmapsSuspenseQuery
>;
export type OrgHeatmapsQueryResult = Apollo.QueryResult<
  OrgHeatmapsQuery,
  OrgHeatmapsQueryVariables
>;
export const OrgLicenseCreateDocument = gql`
  mutation orgLicenseCreate {
    orgLicenseCreate {
      ...OrgLicense
    }
  }
  ${OrgLicenseFragmentDoc}
`;
export type OrgLicenseCreateMutationFn = Apollo.MutationFunction<
  OrgLicenseCreateMutation,
  OrgLicenseCreateMutationVariables
>;

/**
 * __useOrgLicenseCreateMutation__
 *
 * To run a mutation, you first call `useOrgLicenseCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrgLicenseCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orgLicenseCreateMutation, { data, loading, error }] = useOrgLicenseCreateMutation({
 *   variables: {
 *   },
 * });
 */
export function useOrgLicenseCreateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OrgLicenseCreateMutation,
    OrgLicenseCreateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<OrgLicenseCreateMutation, OrgLicenseCreateMutationVariables>(
    OrgLicenseCreateDocument,
    options
  );
}
export type OrgLicenseCreateMutationHookResult = ReturnType<
  typeof useOrgLicenseCreateMutation
>;
export type OrgLicenseCreateMutationResult =
  Apollo.MutationResult<OrgLicenseCreateMutation>;
export type OrgLicenseCreateMutationOptions = Apollo.BaseMutationOptions<
  OrgLicenseCreateMutation,
  OrgLicenseCreateMutationVariables
>;
export const OrgLicenseEnableDocument = gql`
  mutation orgLicenseEnable($input: LicenseEnableInput!) {
    orgLicenseEnable(input: $input) {
      ...OrgLicense
    }
  }
  ${OrgLicenseFragmentDoc}
`;
export type OrgLicenseEnableMutationFn = Apollo.MutationFunction<
  OrgLicenseEnableMutation,
  OrgLicenseEnableMutationVariables
>;

/**
 * __useOrgLicenseEnableMutation__
 *
 * To run a mutation, you first call `useOrgLicenseEnableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrgLicenseEnableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orgLicenseEnableMutation, { data, loading, error }] = useOrgLicenseEnableMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrgLicenseEnableMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OrgLicenseEnableMutation,
    OrgLicenseEnableMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<OrgLicenseEnableMutation, OrgLicenseEnableMutationVariables>(
    OrgLicenseEnableDocument,
    options
  );
}
export type OrgLicenseEnableMutationHookResult = ReturnType<
  typeof useOrgLicenseEnableMutation
>;
export type OrgLicenseEnableMutationResult =
  Apollo.MutationResult<OrgLicenseEnableMutation>;
export type OrgLicenseEnableMutationOptions = Apollo.BaseMutationOptions<
  OrgLicenseEnableMutation,
  OrgLicenseEnableMutationVariables
>;
export const OrgLicenseDisableDocument = gql`
  mutation orgLicenseDisable($input: LicenseDisableInput!) {
    orgLicenseDisable(input: $input) {
      ...OrgLicense
    }
  }
  ${OrgLicenseFragmentDoc}
`;
export type OrgLicenseDisableMutationFn = Apollo.MutationFunction<
  OrgLicenseDisableMutation,
  OrgLicenseDisableMutationVariables
>;

/**
 * __useOrgLicenseDisableMutation__
 *
 * To run a mutation, you first call `useOrgLicenseDisableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrgLicenseDisableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orgLicenseDisableMutation, { data, loading, error }] = useOrgLicenseDisableMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrgLicenseDisableMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OrgLicenseDisableMutation,
    OrgLicenseDisableMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OrgLicenseDisableMutation,
    OrgLicenseDisableMutationVariables
  >(OrgLicenseDisableDocument, options);
}
export type OrgLicenseDisableMutationHookResult = ReturnType<
  typeof useOrgLicenseDisableMutation
>;
export type OrgLicenseDisableMutationResult =
  Apollo.MutationResult<OrgLicenseDisableMutation>;
export type OrgLicenseDisableMutationOptions = Apollo.BaseMutationOptions<
  OrgLicenseDisableMutation,
  OrgLicenseDisableMutationVariables
>;
export const OrgLicensesDocument = gql`
  query orgLicenses {
    orgLicenses {
      ...OrgLicense
    }
  }
  ${OrgLicenseFragmentDoc}
`;

/**
 * __useOrgLicensesQuery__
 *
 * To run a query within a React component, call `useOrgLicensesQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrgLicensesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrgLicensesQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrgLicensesQuery(
  baseOptions?: Apollo.QueryHookOptions<OrgLicensesQuery, OrgLicensesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<OrgLicensesQuery, OrgLicensesQueryVariables>(
    OrgLicensesDocument,
    options
  );
}
export function useOrgLicensesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<OrgLicensesQuery, OrgLicensesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<OrgLicensesQuery, OrgLicensesQueryVariables>(
    OrgLicensesDocument,
    options
  );
}
export function useOrgLicensesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    OrgLicensesQuery,
    OrgLicensesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<OrgLicensesQuery, OrgLicensesQueryVariables>(
    OrgLicensesDocument,
    options
  );
}
export type OrgLicensesQueryHookResult = ReturnType<typeof useOrgLicensesQuery>;
export type OrgLicensesLazyQueryHookResult = ReturnType<typeof useOrgLicensesLazyQuery>;
export type OrgLicensesSuspenseQueryHookResult = ReturnType<
  typeof useOrgLicensesSuspenseQuery
>;
export type OrgLicensesQueryResult = Apollo.QueryResult<
  OrgLicensesQuery,
  OrgLicensesQueryVariables
>;
export const OrgFeaturesUpdateDocument = gql`
  mutation orgFeaturesUpdate($input: OrgFeaturesUpdateInput!) {
    orgFeaturesUpdate(input: $input) {
      multiProperties
    }
  }
`;
export type OrgFeaturesUpdateMutationFn = Apollo.MutationFunction<
  OrgFeaturesUpdateMutation,
  OrgFeaturesUpdateMutationVariables
>;

/**
 * __useOrgFeaturesUpdateMutation__
 *
 * To run a mutation, you first call `useOrgFeaturesUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrgFeaturesUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orgFeaturesUpdateMutation, { data, loading, error }] = useOrgFeaturesUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrgFeaturesUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OrgFeaturesUpdateMutation,
    OrgFeaturesUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OrgFeaturesUpdateMutation,
    OrgFeaturesUpdateMutationVariables
  >(OrgFeaturesUpdateDocument, options);
}
export type OrgFeaturesUpdateMutationHookResult = ReturnType<
  typeof useOrgFeaturesUpdateMutation
>;
export type OrgFeaturesUpdateMutationResult =
  Apollo.MutationResult<OrgFeaturesUpdateMutation>;
export type OrgFeaturesUpdateMutationOptions = Apollo.BaseMutationOptions<
  OrgFeaturesUpdateMutation,
  OrgFeaturesUpdateMutationVariables
>;
export const DataAdapterEnableDocument = gql`
  mutation dataAdapterEnable {
    dataAdapterEnable {
      id
    }
  }
`;
export type DataAdapterEnableMutationFn = Apollo.MutationFunction<
  DataAdapterEnableMutation,
  DataAdapterEnableMutationVariables
>;

/**
 * __useDataAdapterEnableMutation__
 *
 * To run a mutation, you first call `useDataAdapterEnableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDataAdapterEnableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dataAdapterEnableMutation, { data, loading, error }] = useDataAdapterEnableMutation({
 *   variables: {
 *   },
 * });
 */
export function useDataAdapterEnableMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DataAdapterEnableMutation,
    DataAdapterEnableMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DataAdapterEnableMutation,
    DataAdapterEnableMutationVariables
  >(DataAdapterEnableDocument, options);
}
export type DataAdapterEnableMutationHookResult = ReturnType<
  typeof useDataAdapterEnableMutation
>;
export type DataAdapterEnableMutationResult =
  Apollo.MutationResult<DataAdapterEnableMutation>;
export type DataAdapterEnableMutationOptions = Apollo.BaseMutationOptions<
  DataAdapterEnableMutation,
  DataAdapterEnableMutationVariables
>;
export const SiteMappingUpdateDocument = gql`
  mutation siteMappingUpdate($input: FeedSiteMappingUpdateInput!) {
    feedSiteMappingUpdate(input: $input) {
      id
      sourceSiteId
    }
  }
`;
export type SiteMappingUpdateMutationFn = Apollo.MutationFunction<
  SiteMappingUpdateMutation,
  SiteMappingUpdateMutationVariables
>;

/**
 * __useSiteMappingUpdateMutation__
 *
 * To run a mutation, you first call `useSiteMappingUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSiteMappingUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [siteMappingUpdateMutation, { data, loading, error }] = useSiteMappingUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSiteMappingUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SiteMappingUpdateMutation,
    SiteMappingUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SiteMappingUpdateMutation,
    SiteMappingUpdateMutationVariables
  >(SiteMappingUpdateDocument, options);
}
export type SiteMappingUpdateMutationHookResult = ReturnType<
  typeof useSiteMappingUpdateMutation
>;
export type SiteMappingUpdateMutationResult =
  Apollo.MutationResult<SiteMappingUpdateMutation>;
export type SiteMappingUpdateMutationOptions = Apollo.BaseMutationOptions<
  SiteMappingUpdateMutation,
  SiteMappingUpdateMutationVariables
>;
export const CurrentOrgSummaryDocument = gql`
  query currentOrgSummary {
    currentOrg {
      ...OrgSummary
      dataAdapterAllowed
    }
  }
  ${OrgSummaryFragmentDoc}
`;

/**
 * __useCurrentOrgSummaryQuery__
 *
 * To run a query within a React component, call `useCurrentOrgSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentOrgSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentOrgSummaryQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentOrgSummaryQuery(
  baseOptions?: Apollo.QueryHookOptions<
    CurrentOrgSummaryQuery,
    CurrentOrgSummaryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CurrentOrgSummaryQuery, CurrentOrgSummaryQueryVariables>(
    CurrentOrgSummaryDocument,
    options
  );
}
export function useCurrentOrgSummaryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CurrentOrgSummaryQuery,
    CurrentOrgSummaryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CurrentOrgSummaryQuery, CurrentOrgSummaryQueryVariables>(
    CurrentOrgSummaryDocument,
    options
  );
}
export function useCurrentOrgSummarySuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    CurrentOrgSummaryQuery,
    CurrentOrgSummaryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<CurrentOrgSummaryQuery, CurrentOrgSummaryQueryVariables>(
    CurrentOrgSummaryDocument,
    options
  );
}
export type CurrentOrgSummaryQueryHookResult = ReturnType<
  typeof useCurrentOrgSummaryQuery
>;
export type CurrentOrgSummaryLazyQueryHookResult = ReturnType<
  typeof useCurrentOrgSummaryLazyQuery
>;
export type CurrentOrgSummarySuspenseQueryHookResult = ReturnType<
  typeof useCurrentOrgSummarySuspenseQuery
>;
export type CurrentOrgSummaryQueryResult = Apollo.QueryResult<
  CurrentOrgSummaryQuery,
  CurrentOrgSummaryQueryVariables
>;
export const OrgDataAdapterEnabledDocument = gql`
  query orgDataAdapterEnabled {
    org: currentOrg {
      id
      dataAdapterEnabled
    }
  }
`;

/**
 * __useOrgDataAdapterEnabledQuery__
 *
 * To run a query within a React component, call `useOrgDataAdapterEnabledQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrgDataAdapterEnabledQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrgDataAdapterEnabledQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrgDataAdapterEnabledQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OrgDataAdapterEnabledQuery,
    OrgDataAdapterEnabledQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<OrgDataAdapterEnabledQuery, OrgDataAdapterEnabledQueryVariables>(
    OrgDataAdapterEnabledDocument,
    options
  );
}
export function useOrgDataAdapterEnabledLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OrgDataAdapterEnabledQuery,
    OrgDataAdapterEnabledQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OrgDataAdapterEnabledQuery,
    OrgDataAdapterEnabledQueryVariables
  >(OrgDataAdapterEnabledDocument, options);
}
export function useOrgDataAdapterEnabledSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    OrgDataAdapterEnabledQuery,
    OrgDataAdapterEnabledQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    OrgDataAdapterEnabledQuery,
    OrgDataAdapterEnabledQueryVariables
  >(OrgDataAdapterEnabledDocument, options);
}
export type OrgDataAdapterEnabledQueryHookResult = ReturnType<
  typeof useOrgDataAdapterEnabledQuery
>;
export type OrgDataAdapterEnabledLazyQueryHookResult = ReturnType<
  typeof useOrgDataAdapterEnabledLazyQuery
>;
export type OrgDataAdapterEnabledSuspenseQueryHookResult = ReturnType<
  typeof useOrgDataAdapterEnabledSuspenseQuery
>;
export type OrgDataAdapterEnabledQueryResult = Apollo.QueryResult<
  OrgDataAdapterEnabledQuery,
  OrgDataAdapterEnabledQueryVariables
>;
export const OrgStageDatabaseDocument = gql`
  query orgStageDatabase {
    org: currentOrg {
      id
      dataAdapter {
        id
        stageDb {
          host
          port
          databaseName
          username
          password
        }
      }
    }
  }
`;

/**
 * __useOrgStageDatabaseQuery__
 *
 * To run a query within a React component, call `useOrgStageDatabaseQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrgStageDatabaseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrgStageDatabaseQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrgStageDatabaseQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OrgStageDatabaseQuery,
    OrgStageDatabaseQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<OrgStageDatabaseQuery, OrgStageDatabaseQueryVariables>(
    OrgStageDatabaseDocument,
    options
  );
}
export function useOrgStageDatabaseLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OrgStageDatabaseQuery,
    OrgStageDatabaseQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<OrgStageDatabaseQuery, OrgStageDatabaseQueryVariables>(
    OrgStageDatabaseDocument,
    options
  );
}
export function useOrgStageDatabaseSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    OrgStageDatabaseQuery,
    OrgStageDatabaseQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<OrgStageDatabaseQuery, OrgStageDatabaseQueryVariables>(
    OrgStageDatabaseDocument,
    options
  );
}
export type OrgStageDatabaseQueryHookResult = ReturnType<typeof useOrgStageDatabaseQuery>;
export type OrgStageDatabaseLazyQueryHookResult = ReturnType<
  typeof useOrgStageDatabaseLazyQuery
>;
export type OrgStageDatabaseSuspenseQueryHookResult = ReturnType<
  typeof useOrgStageDatabaseSuspenseQuery
>;
export type OrgStageDatabaseQueryResult = Apollo.QueryResult<
  OrgStageDatabaseQuery,
  OrgStageDatabaseQueryVariables
>;
export const OrgSitesMappingDocument = gql`
  query orgSitesMapping {
    org: currentOrg {
      id
      sites {
        ...SiteMapping
      }
    }
  }
  ${SiteMappingFragmentDoc}
`;

/**
 * __useOrgSitesMappingQuery__
 *
 * To run a query within a React component, call `useOrgSitesMappingQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrgSitesMappingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrgSitesMappingQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrgSitesMappingQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OrgSitesMappingQuery,
    OrgSitesMappingQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<OrgSitesMappingQuery, OrgSitesMappingQueryVariables>(
    OrgSitesMappingDocument,
    options
  );
}
export function useOrgSitesMappingLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OrgSitesMappingQuery,
    OrgSitesMappingQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<OrgSitesMappingQuery, OrgSitesMappingQueryVariables>(
    OrgSitesMappingDocument,
    options
  );
}
export function useOrgSitesMappingSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    OrgSitesMappingQuery,
    OrgSitesMappingQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<OrgSitesMappingQuery, OrgSitesMappingQueryVariables>(
    OrgSitesMappingDocument,
    options
  );
}
export type OrgSitesMappingQueryHookResult = ReturnType<typeof useOrgSitesMappingQuery>;
export type OrgSitesMappingLazyQueryHookResult = ReturnType<
  typeof useOrgSitesMappingLazyQuery
>;
export type OrgSitesMappingSuspenseQueryHookResult = ReturnType<
  typeof useOrgSitesMappingSuspenseQuery
>;
export type OrgSitesMappingQueryResult = Apollo.QueryResult<
  OrgSitesMappingQuery,
  OrgSitesMappingQueryVariables
>;
export const OrgSitesDatasourcesDocument = gql`
  query orgSitesDatasources {
    org: currentOrg {
      id
      sites {
        ...SiteDatasource
      }
    }
  }
  ${SiteDatasourceFragmentDoc}
`;

/**
 * __useOrgSitesDatasourcesQuery__
 *
 * To run a query within a React component, call `useOrgSitesDatasourcesQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrgSitesDatasourcesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrgSitesDatasourcesQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrgSitesDatasourcesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OrgSitesDatasourcesQuery,
    OrgSitesDatasourcesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<OrgSitesDatasourcesQuery, OrgSitesDatasourcesQueryVariables>(
    OrgSitesDatasourcesDocument,
    options
  );
}
export function useOrgSitesDatasourcesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OrgSitesDatasourcesQuery,
    OrgSitesDatasourcesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<OrgSitesDatasourcesQuery, OrgSitesDatasourcesQueryVariables>(
    OrgSitesDatasourcesDocument,
    options
  );
}
export function useOrgSitesDatasourcesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    OrgSitesDatasourcesQuery,
    OrgSitesDatasourcesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    OrgSitesDatasourcesQuery,
    OrgSitesDatasourcesQueryVariables
  >(OrgSitesDatasourcesDocument, options);
}
export type OrgSitesDatasourcesQueryHookResult = ReturnType<
  typeof useOrgSitesDatasourcesQuery
>;
export type OrgSitesDatasourcesLazyQueryHookResult = ReturnType<
  typeof useOrgSitesDatasourcesLazyQuery
>;
export type OrgSitesDatasourcesSuspenseQueryHookResult = ReturnType<
  typeof useOrgSitesDatasourcesSuspenseQuery
>;
export type OrgSitesDatasourcesQueryResult = Apollo.QueryResult<
  OrgSitesDatasourcesQuery,
  OrgSitesDatasourcesQueryVariables
>;
export const SubscriptionCreateDocument = gql`
  mutation subscriptionCreate($input: SubscriptionCreateInput!) {
    subscriptionCreate(input: $input) {
      id
    }
  }
`;
export type SubscriptionCreateMutationFn = Apollo.MutationFunction<
  SubscriptionCreateMutation,
  SubscriptionCreateMutationVariables
>;

/**
 * __useSubscriptionCreateMutation__
 *
 * To run a mutation, you first call `useSubscriptionCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubscriptionCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [subscriptionCreateMutation, { data, loading, error }] = useSubscriptionCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSubscriptionCreateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SubscriptionCreateMutation,
    SubscriptionCreateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SubscriptionCreateMutation,
    SubscriptionCreateMutationVariables
  >(SubscriptionCreateDocument, options);
}
export type SubscriptionCreateMutationHookResult = ReturnType<
  typeof useSubscriptionCreateMutation
>;
export type SubscriptionCreateMutationResult =
  Apollo.MutationResult<SubscriptionCreateMutation>;
export type SubscriptionCreateMutationOptions = Apollo.BaseMutationOptions<
  SubscriptionCreateMutation,
  SubscriptionCreateMutationVariables
>;
export const SubscriptionPlansDocument = gql`
  query subscriptionPlans {
    subscriptionPlans {
      ...SubscriptionPlan
    }
  }
  ${SubscriptionPlanFragmentDoc}
`;

/**
 * __useSubscriptionPlansQuery__
 *
 * To run a query within a React component, call `useSubscriptionPlansQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubscriptionPlansQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscriptionPlansQuery({
 *   variables: {
 *   },
 * });
 */
export function useSubscriptionPlansQuery(
  baseOptions?: Apollo.QueryHookOptions<
    SubscriptionPlansQuery,
    SubscriptionPlansQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SubscriptionPlansQuery, SubscriptionPlansQueryVariables>(
    SubscriptionPlansDocument,
    options
  );
}
export function useSubscriptionPlansLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SubscriptionPlansQuery,
    SubscriptionPlansQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SubscriptionPlansQuery, SubscriptionPlansQueryVariables>(
    SubscriptionPlansDocument,
    options
  );
}
export function useSubscriptionPlansSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SubscriptionPlansQuery,
    SubscriptionPlansQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<SubscriptionPlansQuery, SubscriptionPlansQueryVariables>(
    SubscriptionPlansDocument,
    options
  );
}
export type SubscriptionPlansQueryHookResult = ReturnType<
  typeof useSubscriptionPlansQuery
>;
export type SubscriptionPlansLazyQueryHookResult = ReturnType<
  typeof useSubscriptionPlansLazyQuery
>;
export type SubscriptionPlansSuspenseQueryHookResult = ReturnType<
  typeof useSubscriptionPlansSuspenseQuery
>;
export type SubscriptionPlansQueryResult = Apollo.QueryResult<
  SubscriptionPlansQuery,
  SubscriptionPlansQueryVariables
>;
export const ImpersonateUserDocument = gql`
  mutation impersonateUser($userId: String!, $redirectUrl: String!) {
    sudoImpersonateUser: sudoImpersonateUserV2(userId: $userId, redirectUrl: $redirectUrl)
  }
`;
export type ImpersonateUserMutationFn = Apollo.MutationFunction<
  ImpersonateUserMutation,
  ImpersonateUserMutationVariables
>;

/**
 * __useImpersonateUserMutation__
 *
 * To run a mutation, you first call `useImpersonateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useImpersonateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [impersonateUserMutation, { data, loading, error }] = useImpersonateUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      redirectUrl: // value for 'redirectUrl'
 *   },
 * });
 */
export function useImpersonateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ImpersonateUserMutation,
    ImpersonateUserMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ImpersonateUserMutation, ImpersonateUserMutationVariables>(
    ImpersonateUserDocument,
    options
  );
}
export type ImpersonateUserMutationHookResult = ReturnType<
  typeof useImpersonateUserMutation
>;
export type ImpersonateUserMutationResult =
  Apollo.MutationResult<ImpersonateUserMutation>;
export type ImpersonateUserMutationOptions = Apollo.BaseMutationOptions<
  ImpersonateUserMutation,
  ImpersonateUserMutationVariables
>;
export const OdrDataConnectorCreateDocument = gql`
  mutation odrDataConnectorCreate($input: OdrDataConnectorCreateInput!) {
    odrDataConnectorCreate(input: $input) {
      ...DataConnectorFields
    }
  }
  ${DataConnectorFieldsFragmentDoc}
`;
export type OdrDataConnectorCreateMutationFn = Apollo.MutationFunction<
  OdrDataConnectorCreateMutation,
  OdrDataConnectorCreateMutationVariables
>;

/**
 * __useOdrDataConnectorCreateMutation__
 *
 * To run a mutation, you first call `useOdrDataConnectorCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOdrDataConnectorCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [odrDataConnectorCreateMutation, { data, loading, error }] = useOdrDataConnectorCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOdrDataConnectorCreateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OdrDataConnectorCreateMutation,
    OdrDataConnectorCreateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OdrDataConnectorCreateMutation,
    OdrDataConnectorCreateMutationVariables
  >(OdrDataConnectorCreateDocument, options);
}
export type OdrDataConnectorCreateMutationHookResult = ReturnType<
  typeof useOdrDataConnectorCreateMutation
>;
export type OdrDataConnectorCreateMutationResult =
  Apollo.MutationResult<OdrDataConnectorCreateMutation>;
export type OdrDataConnectorCreateMutationOptions = Apollo.BaseMutationOptions<
  OdrDataConnectorCreateMutation,
  OdrDataConnectorCreateMutationVariables
>;
export const OdrDataConnectorUpdateDocument = gql`
  mutation odrDataConnectorUpdate($input: OdrDataConnectorUpdateInput!) {
    odrDataConnectorUpdate(input: $input) {
      ...DataConnectorFields
    }
  }
  ${DataConnectorFieldsFragmentDoc}
`;
export type OdrDataConnectorUpdateMutationFn = Apollo.MutationFunction<
  OdrDataConnectorUpdateMutation,
  OdrDataConnectorUpdateMutationVariables
>;

/**
 * __useOdrDataConnectorUpdateMutation__
 *
 * To run a mutation, you first call `useOdrDataConnectorUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOdrDataConnectorUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [odrDataConnectorUpdateMutation, { data, loading, error }] = useOdrDataConnectorUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOdrDataConnectorUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OdrDataConnectorUpdateMutation,
    OdrDataConnectorUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OdrDataConnectorUpdateMutation,
    OdrDataConnectorUpdateMutationVariables
  >(OdrDataConnectorUpdateDocument, options);
}
export type OdrDataConnectorUpdateMutationHookResult = ReturnType<
  typeof useOdrDataConnectorUpdateMutation
>;
export type OdrDataConnectorUpdateMutationResult =
  Apollo.MutationResult<OdrDataConnectorUpdateMutation>;
export type OdrDataConnectorUpdateMutationOptions = Apollo.BaseMutationOptions<
  OdrDataConnectorUpdateMutation,
  OdrDataConnectorUpdateMutationVariables
>;
export const OdrDataConnectorsDocument = gql`
  query odrDataConnectors {
    odrDataConnectors {
      ...DataConnectorFields
    }
  }
  ${DataConnectorFieldsFragmentDoc}
`;

/**
 * __useOdrDataConnectorsQuery__
 *
 * To run a query within a React component, call `useOdrDataConnectorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOdrDataConnectorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOdrDataConnectorsQuery({
 *   variables: {
 *   },
 * });
 */
export function useOdrDataConnectorsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OdrDataConnectorsQuery,
    OdrDataConnectorsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<OdrDataConnectorsQuery, OdrDataConnectorsQueryVariables>(
    OdrDataConnectorsDocument,
    options
  );
}
export function useOdrDataConnectorsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OdrDataConnectorsQuery,
    OdrDataConnectorsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<OdrDataConnectorsQuery, OdrDataConnectorsQueryVariables>(
    OdrDataConnectorsDocument,
    options
  );
}
export function useOdrDataConnectorsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    OdrDataConnectorsQuery,
    OdrDataConnectorsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<OdrDataConnectorsQuery, OdrDataConnectorsQueryVariables>(
    OdrDataConnectorsDocument,
    options
  );
}
export type OdrDataConnectorsQueryHookResult = ReturnType<
  typeof useOdrDataConnectorsQuery
>;
export type OdrDataConnectorsLazyQueryHookResult = ReturnType<
  typeof useOdrDataConnectorsLazyQuery
>;
export type OdrDataConnectorsSuspenseQueryHookResult = ReturnType<
  typeof useOdrDataConnectorsSuspenseQuery
>;
export type OdrDataConnectorsQueryResult = Apollo.QueryResult<
  OdrDataConnectorsQuery,
  OdrDataConnectorsQueryVariables
>;
export const OdrDataConnectorHostSitesDocument = gql`
  query odrDataConnectorHostSites($id: ID!) {
    connector: odrDataConnector(id: $id) {
      ...DataConnectorHostSites
    }
  }
  ${DataConnectorHostSitesFragmentDoc}
`;

/**
 * __useOdrDataConnectorHostSitesQuery__
 *
 * To run a query within a React component, call `useOdrDataConnectorHostSitesQuery` and pass it any options that fit your needs.
 * When your component renders, `useOdrDataConnectorHostSitesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOdrDataConnectorHostSitesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOdrDataConnectorHostSitesQuery(
  baseOptions: Apollo.QueryHookOptions<
    OdrDataConnectorHostSitesQuery,
    OdrDataConnectorHostSitesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OdrDataConnectorHostSitesQuery,
    OdrDataConnectorHostSitesQueryVariables
  >(OdrDataConnectorHostSitesDocument, options);
}
export function useOdrDataConnectorHostSitesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OdrDataConnectorHostSitesQuery,
    OdrDataConnectorHostSitesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OdrDataConnectorHostSitesQuery,
    OdrDataConnectorHostSitesQueryVariables
  >(OdrDataConnectorHostSitesDocument, options);
}
export function useOdrDataConnectorHostSitesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    OdrDataConnectorHostSitesQuery,
    OdrDataConnectorHostSitesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    OdrDataConnectorHostSitesQuery,
    OdrDataConnectorHostSitesQueryVariables
  >(OdrDataConnectorHostSitesDocument, options);
}
export type OdrDataConnectorHostSitesQueryHookResult = ReturnType<
  typeof useOdrDataConnectorHostSitesQuery
>;
export type OdrDataConnectorHostSitesLazyQueryHookResult = ReturnType<
  typeof useOdrDataConnectorHostSitesLazyQuery
>;
export type OdrDataConnectorHostSitesSuspenseQueryHookResult = ReturnType<
  typeof useOdrDataConnectorHostSitesSuspenseQuery
>;
export type OdrDataConnectorHostSitesQueryResult = Apollo.QueryResult<
  OdrDataConnectorHostSitesQuery,
  OdrDataConnectorHostSitesQueryVariables
>;
export const OdrDataSourceUpdateDocument = gql`
  mutation odrDataSourceUpdate($input: OdrDataSourceUpdateInput!) {
    odrDataSourceUpdate(input: $input) {
      ...DataSourceFields
    }
  }
  ${DataSourceFieldsFragmentDoc}
`;
export type OdrDataSourceUpdateMutationFn = Apollo.MutationFunction<
  OdrDataSourceUpdateMutation,
  OdrDataSourceUpdateMutationVariables
>;

/**
 * __useOdrDataSourceUpdateMutation__
 *
 * To run a mutation, you first call `useOdrDataSourceUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOdrDataSourceUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [odrDataSourceUpdateMutation, { data, loading, error }] = useOdrDataSourceUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOdrDataSourceUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OdrDataSourceUpdateMutation,
    OdrDataSourceUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OdrDataSourceUpdateMutation,
    OdrDataSourceUpdateMutationVariables
  >(OdrDataSourceUpdateDocument, options);
}
export type OdrDataSourceUpdateMutationHookResult = ReturnType<
  typeof useOdrDataSourceUpdateMutation
>;
export type OdrDataSourceUpdateMutationResult =
  Apollo.MutationResult<OdrDataSourceUpdateMutation>;
export type OdrDataSourceUpdateMutationOptions = Apollo.BaseMutationOptions<
  OdrDataSourceUpdateMutation,
  OdrDataSourceUpdateMutationVariables
>;
export const OdrDataSourcesDocument = gql`
  query odrDataSources {
    odrDataSources {
      ...DataSourceFields
    }
  }
  ${DataSourceFieldsFragmentDoc}
`;

/**
 * __useOdrDataSourcesQuery__
 *
 * To run a query within a React component, call `useOdrDataSourcesQuery` and pass it any options that fit your needs.
 * When your component renders, `useOdrDataSourcesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOdrDataSourcesQuery({
 *   variables: {
 *   },
 * });
 */
export function useOdrDataSourcesQuery(
  baseOptions?: Apollo.QueryHookOptions<OdrDataSourcesQuery, OdrDataSourcesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<OdrDataSourcesQuery, OdrDataSourcesQueryVariables>(
    OdrDataSourcesDocument,
    options
  );
}
export function useOdrDataSourcesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OdrDataSourcesQuery,
    OdrDataSourcesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<OdrDataSourcesQuery, OdrDataSourcesQueryVariables>(
    OdrDataSourcesDocument,
    options
  );
}
export function useOdrDataSourcesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    OdrDataSourcesQuery,
    OdrDataSourcesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<OdrDataSourcesQuery, OdrDataSourcesQueryVariables>(
    OdrDataSourcesDocument,
    options
  );
}
export type OdrDataSourcesQueryHookResult = ReturnType<typeof useOdrDataSourcesQuery>;
export type OdrDataSourcesLazyQueryHookResult = ReturnType<
  typeof useOdrDataSourcesLazyQuery
>;
export type OdrDataSourcesSuspenseQueryHookResult = ReturnType<
  typeof useOdrDataSourcesSuspenseQuery
>;
export type OdrDataSourcesQueryResult = Apollo.QueryResult<
  OdrDataSourcesQuery,
  OdrDataSourcesQueryVariables
>;
export const GreetRulesPriorityUpdateDocument = gql`
  mutation greetRulesPriorityUpdate($ruleIds: [ID!]!, $siteId: ID!) {
    pdGreetRulesPriorityUpdate(ruleIds: $ruleIds, siteId: $siteId) {
      ...GreetRule
    }
  }
  ${GreetRuleFragmentDoc}
`;
export type GreetRulesPriorityUpdateMutationFn = Apollo.MutationFunction<
  GreetRulesPriorityUpdateMutation,
  GreetRulesPriorityUpdateMutationVariables
>;

/**
 * __useGreetRulesPriorityUpdateMutation__
 *
 * To run a mutation, you first call `useGreetRulesPriorityUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGreetRulesPriorityUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [greetRulesPriorityUpdateMutation, { data, loading, error }] = useGreetRulesPriorityUpdateMutation({
 *   variables: {
 *      ruleIds: // value for 'ruleIds'
 *      siteId: // value for 'siteId'
 *   },
 * });
 */
export function useGreetRulesPriorityUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GreetRulesPriorityUpdateMutation,
    GreetRulesPriorityUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GreetRulesPriorityUpdateMutation,
    GreetRulesPriorityUpdateMutationVariables
  >(GreetRulesPriorityUpdateDocument, options);
}
export type GreetRulesPriorityUpdateMutationHookResult = ReturnType<
  typeof useGreetRulesPriorityUpdateMutation
>;
export type GreetRulesPriorityUpdateMutationResult =
  Apollo.MutationResult<GreetRulesPriorityUpdateMutation>;
export type GreetRulesPriorityUpdateMutationOptions = Apollo.BaseMutationOptions<
  GreetRulesPriorityUpdateMutation,
  GreetRulesPriorityUpdateMutationVariables
>;
export const GreetRuleCreateDocument = gql`
  mutation greetRuleCreate($input: PdGreetRuleCreateInput!) {
    pdGreetRuleCreate(input: $input) {
      ...GreetRule
    }
  }
  ${GreetRuleFragmentDoc}
`;
export type GreetRuleCreateMutationFn = Apollo.MutationFunction<
  GreetRuleCreateMutation,
  GreetRuleCreateMutationVariables
>;

/**
 * __useGreetRuleCreateMutation__
 *
 * To run a mutation, you first call `useGreetRuleCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGreetRuleCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [greetRuleCreateMutation, { data, loading, error }] = useGreetRuleCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGreetRuleCreateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GreetRuleCreateMutation,
    GreetRuleCreateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GreetRuleCreateMutation, GreetRuleCreateMutationVariables>(
    GreetRuleCreateDocument,
    options
  );
}
export type GreetRuleCreateMutationHookResult = ReturnType<
  typeof useGreetRuleCreateMutation
>;
export type GreetRuleCreateMutationResult =
  Apollo.MutationResult<GreetRuleCreateMutation>;
export type GreetRuleCreateMutationOptions = Apollo.BaseMutationOptions<
  GreetRuleCreateMutation,
  GreetRuleCreateMutationVariables
>;
export const PdGreetRuleUpdateDocument = gql`
  mutation pdGreetRuleUpdate($input: PdGreetRuleUpdateInput!) {
    pdGreetRuleUpdate(input: $input) {
      ...GreetRule
    }
  }
  ${GreetRuleFragmentDoc}
`;
export type PdGreetRuleUpdateMutationFn = Apollo.MutationFunction<
  PdGreetRuleUpdateMutation,
  PdGreetRuleUpdateMutationVariables
>;

/**
 * __usePdGreetRuleUpdateMutation__
 *
 * To run a mutation, you first call `usePdGreetRuleUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePdGreetRuleUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pdGreetRuleUpdateMutation, { data, loading, error }] = usePdGreetRuleUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePdGreetRuleUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PdGreetRuleUpdateMutation,
    PdGreetRuleUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    PdGreetRuleUpdateMutation,
    PdGreetRuleUpdateMutationVariables
  >(PdGreetRuleUpdateDocument, options);
}
export type PdGreetRuleUpdateMutationHookResult = ReturnType<
  typeof usePdGreetRuleUpdateMutation
>;
export type PdGreetRuleUpdateMutationResult =
  Apollo.MutationResult<PdGreetRuleUpdateMutation>;
export type PdGreetRuleUpdateMutationOptions = Apollo.BaseMutationOptions<
  PdGreetRuleUpdateMutation,
  PdGreetRuleUpdateMutationVariables
>;
export const GreetRuleDeleteDocument = gql`
  mutation greetRuleDelete($id: ID!, $siteId: ID!) {
    pdGreetRuleDelete(id: $id, siteId: $siteId)
  }
`;
export type GreetRuleDeleteMutationFn = Apollo.MutationFunction<
  GreetRuleDeleteMutation,
  GreetRuleDeleteMutationVariables
>;

/**
 * __useGreetRuleDeleteMutation__
 *
 * To run a mutation, you first call `useGreetRuleDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGreetRuleDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [greetRuleDeleteMutation, { data, loading, error }] = useGreetRuleDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      siteId: // value for 'siteId'
 *   },
 * });
 */
export function useGreetRuleDeleteMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GreetRuleDeleteMutation,
    GreetRuleDeleteMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GreetRuleDeleteMutation, GreetRuleDeleteMutationVariables>(
    GreetRuleDeleteDocument,
    options
  );
}
export type GreetRuleDeleteMutationHookResult = ReturnType<
  typeof useGreetRuleDeleteMutation
>;
export type GreetRuleDeleteMutationResult =
  Apollo.MutationResult<GreetRuleDeleteMutation>;
export type GreetRuleDeleteMutationOptions = Apollo.BaseMutationOptions<
  GreetRuleDeleteMutation,
  GreetRuleDeleteMutationVariables
>;
export const GreetSettingsUpdateDocument = gql`
  mutation greetSettingsUpdate($input: PdGreetSettingsUpdateInput!) {
    pdGreetSettingsUpdate(input: $input) {
      ...GreetSettings
    }
  }
  ${GreetSettingsFragmentDoc}
`;
export type GreetSettingsUpdateMutationFn = Apollo.MutationFunction<
  GreetSettingsUpdateMutation,
  GreetSettingsUpdateMutationVariables
>;

/**
 * __useGreetSettingsUpdateMutation__
 *
 * To run a mutation, you first call `useGreetSettingsUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGreetSettingsUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [greetSettingsUpdateMutation, { data, loading, error }] = useGreetSettingsUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGreetSettingsUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GreetSettingsUpdateMutation,
    GreetSettingsUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GreetSettingsUpdateMutation,
    GreetSettingsUpdateMutationVariables
  >(GreetSettingsUpdateDocument, options);
}
export type GreetSettingsUpdateMutationHookResult = ReturnType<
  typeof useGreetSettingsUpdateMutation
>;
export type GreetSettingsUpdateMutationResult =
  Apollo.MutationResult<GreetSettingsUpdateMutation>;
export type GreetSettingsUpdateMutationOptions = Apollo.BaseMutationOptions<
  GreetSettingsUpdateMutation,
  GreetSettingsUpdateMutationVariables
>;
export const GreetRulesDocument = gql`
  query greetRules($siteId: ID!) {
    pdGreetRules(siteId: $siteId) {
      ...GreetRule
    }
  }
  ${GreetRuleFragmentDoc}
`;

/**
 * __useGreetRulesQuery__
 *
 * To run a query within a React component, call `useGreetRulesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGreetRulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGreetRulesQuery({
 *   variables: {
 *      siteId: // value for 'siteId'
 *   },
 * });
 */
export function useGreetRulesQuery(
  baseOptions: Apollo.QueryHookOptions<GreetRulesQuery, GreetRulesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GreetRulesQuery, GreetRulesQueryVariables>(
    GreetRulesDocument,
    options
  );
}
export function useGreetRulesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GreetRulesQuery, GreetRulesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GreetRulesQuery, GreetRulesQueryVariables>(
    GreetRulesDocument,
    options
  );
}
export function useGreetRulesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GreetRulesQuery, GreetRulesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GreetRulesQuery, GreetRulesQueryVariables>(
    GreetRulesDocument,
    options
  );
}
export type GreetRulesQueryHookResult = ReturnType<typeof useGreetRulesQuery>;
export type GreetRulesLazyQueryHookResult = ReturnType<typeof useGreetRulesLazyQuery>;
export type GreetRulesSuspenseQueryHookResult = ReturnType<
  typeof useGreetRulesSuspenseQuery
>;
export type GreetRulesQueryResult = Apollo.QueryResult<
  GreetRulesQuery,
  GreetRulesQueryVariables
>;
export const GreetSectionsDocument = gql`
  query greetSections($siteId: ID!) {
    pdGreetSections(siteId: $siteId) {
      ...GreetSection
    }
  }
  ${GreetSectionFragmentDoc}
`;

/**
 * __useGreetSectionsQuery__
 *
 * To run a query within a React component, call `useGreetSectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGreetSectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGreetSectionsQuery({
 *   variables: {
 *      siteId: // value for 'siteId'
 *   },
 * });
 */
export function useGreetSectionsQuery(
  baseOptions: Apollo.QueryHookOptions<GreetSectionsQuery, GreetSectionsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GreetSectionsQuery, GreetSectionsQueryVariables>(
    GreetSectionsDocument,
    options
  );
}
export function useGreetSectionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GreetSectionsQuery,
    GreetSectionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GreetSectionsQuery, GreetSectionsQueryVariables>(
    GreetSectionsDocument,
    options
  );
}
export function useGreetSectionsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GreetSectionsQuery,
    GreetSectionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GreetSectionsQuery, GreetSectionsQueryVariables>(
    GreetSectionsDocument,
    options
  );
}
export type GreetSectionsQueryHookResult = ReturnType<typeof useGreetSectionsQuery>;
export type GreetSectionsLazyQueryHookResult = ReturnType<
  typeof useGreetSectionsLazyQuery
>;
export type GreetSectionsSuspenseQueryHookResult = ReturnType<
  typeof useGreetSectionsSuspenseQuery
>;
export type GreetSectionsQueryResult = Apollo.QueryResult<
  GreetSectionsQuery,
  GreetSectionsQueryVariables
>;
export const GreetRuleBuilderOrgDataDocument = gql`
  query greetRuleBuilderOrgData {
    pdOrgSettings {
      id
      tiers {
        ...LoyaltyTier
      }
    }
    pdGreetMetrics {
      ...GreetMetricDefinition
    }
    pdUserGroups {
      ...GreetRuleUserGroup
    }
  }
  ${LoyaltyTierFragmentDoc}
  ${GreetMetricDefinitionFragmentDoc}
  ${GreetRuleUserGroupFragmentDoc}
`;

/**
 * __useGreetRuleBuilderOrgDataQuery__
 *
 * To run a query within a React component, call `useGreetRuleBuilderOrgDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGreetRuleBuilderOrgDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGreetRuleBuilderOrgDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useGreetRuleBuilderOrgDataQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GreetRuleBuilderOrgDataQuery,
    GreetRuleBuilderOrgDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GreetRuleBuilderOrgDataQuery,
    GreetRuleBuilderOrgDataQueryVariables
  >(GreetRuleBuilderOrgDataDocument, options);
}
export function useGreetRuleBuilderOrgDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GreetRuleBuilderOrgDataQuery,
    GreetRuleBuilderOrgDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GreetRuleBuilderOrgDataQuery,
    GreetRuleBuilderOrgDataQueryVariables
  >(GreetRuleBuilderOrgDataDocument, options);
}
export function useGreetRuleBuilderOrgDataSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GreetRuleBuilderOrgDataQuery,
    GreetRuleBuilderOrgDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GreetRuleBuilderOrgDataQuery,
    GreetRuleBuilderOrgDataQueryVariables
  >(GreetRuleBuilderOrgDataDocument, options);
}
export type GreetRuleBuilderOrgDataQueryHookResult = ReturnType<
  typeof useGreetRuleBuilderOrgDataQuery
>;
export type GreetRuleBuilderOrgDataLazyQueryHookResult = ReturnType<
  typeof useGreetRuleBuilderOrgDataLazyQuery
>;
export type GreetRuleBuilderOrgDataSuspenseQueryHookResult = ReturnType<
  typeof useGreetRuleBuilderOrgDataSuspenseQuery
>;
export type GreetRuleBuilderOrgDataQueryResult = Apollo.QueryResult<
  GreetRuleBuilderOrgDataQuery,
  GreetRuleBuilderOrgDataQueryVariables
>;
export const GreetRuleBuilderSiteDataDocument = gql`
  query greetRuleBuilderSiteData($siteId: ID!) {
    pdGreetRules(siteId: $siteId) {
      ...GreetRule
    }
    pdGreetSections(siteId: $siteId) {
      ...GreetSection
    }
  }
  ${GreetRuleFragmentDoc}
  ${GreetSectionFragmentDoc}
`;

/**
 * __useGreetRuleBuilderSiteDataQuery__
 *
 * To run a query within a React component, call `useGreetRuleBuilderSiteDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGreetRuleBuilderSiteDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGreetRuleBuilderSiteDataQuery({
 *   variables: {
 *      siteId: // value for 'siteId'
 *   },
 * });
 */
export function useGreetRuleBuilderSiteDataQuery(
  baseOptions: Apollo.QueryHookOptions<
    GreetRuleBuilderSiteDataQuery,
    GreetRuleBuilderSiteDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GreetRuleBuilderSiteDataQuery,
    GreetRuleBuilderSiteDataQueryVariables
  >(GreetRuleBuilderSiteDataDocument, options);
}
export function useGreetRuleBuilderSiteDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GreetRuleBuilderSiteDataQuery,
    GreetRuleBuilderSiteDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GreetRuleBuilderSiteDataQuery,
    GreetRuleBuilderSiteDataQueryVariables
  >(GreetRuleBuilderSiteDataDocument, options);
}
export function useGreetRuleBuilderSiteDataSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GreetRuleBuilderSiteDataQuery,
    GreetRuleBuilderSiteDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GreetRuleBuilderSiteDataQuery,
    GreetRuleBuilderSiteDataQueryVariables
  >(GreetRuleBuilderSiteDataDocument, options);
}
export type GreetRuleBuilderSiteDataQueryHookResult = ReturnType<
  typeof useGreetRuleBuilderSiteDataQuery
>;
export type GreetRuleBuilderSiteDataLazyQueryHookResult = ReturnType<
  typeof useGreetRuleBuilderSiteDataLazyQuery
>;
export type GreetRuleBuilderSiteDataSuspenseQueryHookResult = ReturnType<
  typeof useGreetRuleBuilderSiteDataSuspenseQuery
>;
export type GreetRuleBuilderSiteDataQueryResult = Apollo.QueryResult<
  GreetRuleBuilderSiteDataQuery,
  GreetRuleBuilderSiteDataQueryVariables
>;
export const GreetSettingsDocument = gql`
  query greetSettings {
    pdGreetSettings {
      ...GreetSettings
    }
  }
  ${GreetSettingsFragmentDoc}
`;

/**
 * __useGreetSettingsQuery__
 *
 * To run a query within a React component, call `useGreetSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGreetSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGreetSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGreetSettingsQuery(
  baseOptions?: Apollo.QueryHookOptions<GreetSettingsQuery, GreetSettingsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GreetSettingsQuery, GreetSettingsQueryVariables>(
    GreetSettingsDocument,
    options
  );
}
export function useGreetSettingsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GreetSettingsQuery,
    GreetSettingsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GreetSettingsQuery, GreetSettingsQueryVariables>(
    GreetSettingsDocument,
    options
  );
}
export function useGreetSettingsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GreetSettingsQuery,
    GreetSettingsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GreetSettingsQuery, GreetSettingsQueryVariables>(
    GreetSettingsDocument,
    options
  );
}
export type GreetSettingsQueryHookResult = ReturnType<typeof useGreetSettingsQuery>;
export type GreetSettingsLazyQueryHookResult = ReturnType<
  typeof useGreetSettingsLazyQuery
>;
export type GreetSettingsSuspenseQueryHookResult = ReturnType<
  typeof useGreetSettingsSuspenseQuery
>;
export type GreetSettingsQueryResult = Apollo.QueryResult<
  GreetSettingsQuery,
  GreetSettingsQueryVariables
>;
export const OrgLoyaltyTiersUpdateDocument = gql`
  mutation orgLoyaltyTiersUpdate($input: [PdTierInput!]) {
    pdOrgSettingsUpdate(input: { tiers: $input }) {
      id
      tiers {
        ...LoyaltyTier
      }
    }
  }
  ${LoyaltyTierFragmentDoc}
`;
export type OrgLoyaltyTiersUpdateMutationFn = Apollo.MutationFunction<
  OrgLoyaltyTiersUpdateMutation,
  OrgLoyaltyTiersUpdateMutationVariables
>;

/**
 * __useOrgLoyaltyTiersUpdateMutation__
 *
 * To run a mutation, you first call `useOrgLoyaltyTiersUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrgLoyaltyTiersUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orgLoyaltyTiersUpdateMutation, { data, loading, error }] = useOrgLoyaltyTiersUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrgLoyaltyTiersUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OrgLoyaltyTiersUpdateMutation,
    OrgLoyaltyTiersUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    OrgLoyaltyTiersUpdateMutation,
    OrgLoyaltyTiersUpdateMutationVariables
  >(OrgLoyaltyTiersUpdateDocument, options);
}
export type OrgLoyaltyTiersUpdateMutationHookResult = ReturnType<
  typeof useOrgLoyaltyTiersUpdateMutation
>;
export type OrgLoyaltyTiersUpdateMutationResult =
  Apollo.MutationResult<OrgLoyaltyTiersUpdateMutation>;
export type OrgLoyaltyTiersUpdateMutationOptions = Apollo.BaseMutationOptions<
  OrgLoyaltyTiersUpdateMutation,
  OrgLoyaltyTiersUpdateMutationVariables
>;
export const CompanyUpdateDocument = gql`
  mutation companyUpdate($input: CompanyInput!) {
    companyUpdate(input: $input) {
      ...CompanyUpdateOutput
    }
  }
  ${CompanyUpdateOutputFragmentDoc}
`;
export type CompanyUpdateMutationFn = Apollo.MutationFunction<
  CompanyUpdateMutation,
  CompanyUpdateMutationVariables
>;

/**
 * __useCompanyUpdateMutation__
 *
 * To run a mutation, you first call `useCompanyUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompanyUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [companyUpdateMutation, { data, loading, error }] = useCompanyUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCompanyUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CompanyUpdateMutation,
    CompanyUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CompanyUpdateMutation, CompanyUpdateMutationVariables>(
    CompanyUpdateDocument,
    options
  );
}
export type CompanyUpdateMutationHookResult = ReturnType<typeof useCompanyUpdateMutation>;
export type CompanyUpdateMutationResult = Apollo.MutationResult<CompanyUpdateMutation>;
export type CompanyUpdateMutationOptions = Apollo.BaseMutationOptions<
  CompanyUpdateMutation,
  CompanyUpdateMutationVariables
>;
export const CurrentOrgFeaturesDocument = gql`
  query currentOrgFeatures {
    currentOrg {
      id
      features {
        multiProperties
      }
    }
  }
`;

/**
 * __useCurrentOrgFeaturesQuery__
 *
 * To run a query within a React component, call `useCurrentOrgFeaturesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentOrgFeaturesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentOrgFeaturesQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentOrgFeaturesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    CurrentOrgFeaturesQuery,
    CurrentOrgFeaturesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CurrentOrgFeaturesQuery, CurrentOrgFeaturesQueryVariables>(
    CurrentOrgFeaturesDocument,
    options
  );
}
export function useCurrentOrgFeaturesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CurrentOrgFeaturesQuery,
    CurrentOrgFeaturesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CurrentOrgFeaturesQuery, CurrentOrgFeaturesQueryVariables>(
    CurrentOrgFeaturesDocument,
    options
  );
}
export function useCurrentOrgFeaturesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    CurrentOrgFeaturesQuery,
    CurrentOrgFeaturesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    CurrentOrgFeaturesQuery,
    CurrentOrgFeaturesQueryVariables
  >(CurrentOrgFeaturesDocument, options);
}
export type CurrentOrgFeaturesQueryHookResult = ReturnType<
  typeof useCurrentOrgFeaturesQuery
>;
export type CurrentOrgFeaturesLazyQueryHookResult = ReturnType<
  typeof useCurrentOrgFeaturesLazyQuery
>;
export type CurrentOrgFeaturesSuspenseQueryHookResult = ReturnType<
  typeof useCurrentOrgFeaturesSuspenseQuery
>;
export type CurrentOrgFeaturesQueryResult = Apollo.QueryResult<
  CurrentOrgFeaturesQuery,
  CurrentOrgFeaturesQueryVariables
>;
export const OrgLoyaltyTiersDocument = gql`
  query orgLoyaltyTiers {
    pdOrgSettings {
      id
      tiers {
        ...LoyaltyTier
      }
    }
  }
  ${LoyaltyTierFragmentDoc}
`;

/**
 * __useOrgLoyaltyTiersQuery__
 *
 * To run a query within a React component, call `useOrgLoyaltyTiersQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrgLoyaltyTiersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrgLoyaltyTiersQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrgLoyaltyTiersQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OrgLoyaltyTiersQuery,
    OrgLoyaltyTiersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<OrgLoyaltyTiersQuery, OrgLoyaltyTiersQueryVariables>(
    OrgLoyaltyTiersDocument,
    options
  );
}
export function useOrgLoyaltyTiersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OrgLoyaltyTiersQuery,
    OrgLoyaltyTiersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<OrgLoyaltyTiersQuery, OrgLoyaltyTiersQueryVariables>(
    OrgLoyaltyTiersDocument,
    options
  );
}
export function useOrgLoyaltyTiersSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    OrgLoyaltyTiersQuery,
    OrgLoyaltyTiersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<OrgLoyaltyTiersQuery, OrgLoyaltyTiersQueryVariables>(
    OrgLoyaltyTiersDocument,
    options
  );
}
export type OrgLoyaltyTiersQueryHookResult = ReturnType<typeof useOrgLoyaltyTiersQuery>;
export type OrgLoyaltyTiersLazyQueryHookResult = ReturnType<
  typeof useOrgLoyaltyTiersLazyQuery
>;
export type OrgLoyaltyTiersSuspenseQueryHookResult = ReturnType<
  typeof useOrgLoyaltyTiersSuspenseQuery
>;
export type OrgLoyaltyTiersQueryResult = Apollo.QueryResult<
  OrgLoyaltyTiersQuery,
  OrgLoyaltyTiersQueryVariables
>;
export const CompanyDocument = gql`
  query company {
    currentOrg {
      id
      company {
        ...GaCompany
      }
    }
  }
  ${GaCompanyFragmentDoc}
`;

/**
 * __useCompanyQuery__
 *
 * To run a query within a React component, call `useCompanyQuery` and pass it any options that fit your needs.
 * When your component renders, `useCompanyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCompanyQuery({
 *   variables: {
 *   },
 * });
 */
export function useCompanyQuery(
  baseOptions?: Apollo.QueryHookOptions<CompanyQuery, CompanyQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CompanyQuery, CompanyQueryVariables>(CompanyDocument, options);
}
export function useCompanyLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CompanyQuery, CompanyQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CompanyQuery, CompanyQueryVariables>(
    CompanyDocument,
    options
  );
}
export function useCompanySuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<CompanyQuery, CompanyQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<CompanyQuery, CompanyQueryVariables>(
    CompanyDocument,
    options
  );
}
export type CompanyQueryHookResult = ReturnType<typeof useCompanyQuery>;
export type CompanyLazyQueryHookResult = ReturnType<typeof useCompanyLazyQuery>;
export type CompanySuspenseQueryHookResult = ReturnType<typeof useCompanySuspenseQuery>;
export type CompanyQueryResult = Apollo.QueryResult<CompanyQuery, CompanyQueryVariables>;
export const PdreRuleConfigUpdateDocument = gql`
  mutation pdreRuleConfigUpdate($input: PdRuleConfigUpdateInput!) {
    pdreRuleConfigUpdate: pdRuleConfigUpdate(input: $input) {
      id
      enabled
      weight
    }
  }
`;
export type PdreRuleConfigUpdateMutationFn = Apollo.MutationFunction<
  PdreRuleConfigUpdateMutation,
  PdreRuleConfigUpdateMutationVariables
>;

/**
 * __usePdreRuleConfigUpdateMutation__
 *
 * To run a mutation, you first call `usePdreRuleConfigUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePdreRuleConfigUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pdreRuleConfigUpdateMutation, { data, loading, error }] = usePdreRuleConfigUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePdreRuleConfigUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PdreRuleConfigUpdateMutation,
    PdreRuleConfigUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    PdreRuleConfigUpdateMutation,
    PdreRuleConfigUpdateMutationVariables
  >(PdreRuleConfigUpdateDocument, options);
}
export type PdreRuleConfigUpdateMutationHookResult = ReturnType<
  typeof usePdreRuleConfigUpdateMutation
>;
export type PdreRuleConfigUpdateMutationResult =
  Apollo.MutationResult<PdreRuleConfigUpdateMutation>;
export type PdreRuleConfigUpdateMutationOptions = Apollo.BaseMutationOptions<
  PdreRuleConfigUpdateMutation,
  PdreRuleConfigUpdateMutationVariables
>;
export const PdreRulesDocument = gql`
  query pdreRules($siteId: ID!) {
    pdreRules: pdRules(siteId: $siteId) {
      ...PdreRule
    }
  }
  ${PdreRuleFragmentDoc}
`;

/**
 * __usePdreRulesQuery__
 *
 * To run a query within a React component, call `usePdreRulesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePdreRulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePdreRulesQuery({
 *   variables: {
 *      siteId: // value for 'siteId'
 *   },
 * });
 */
export function usePdreRulesQuery(
  baseOptions: Apollo.QueryHookOptions<PdreRulesQuery, PdreRulesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PdreRulesQuery, PdreRulesQueryVariables>(
    PdreRulesDocument,
    options
  );
}
export function usePdreRulesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PdreRulesQuery, PdreRulesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PdreRulesQuery, PdreRulesQueryVariables>(
    PdreRulesDocument,
    options
  );
}
export function usePdreRulesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<PdreRulesQuery, PdreRulesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<PdreRulesQuery, PdreRulesQueryVariables>(
    PdreRulesDocument,
    options
  );
}
export type PdreRulesQueryHookResult = ReturnType<typeof usePdreRulesQuery>;
export type PdreRulesLazyQueryHookResult = ReturnType<typeof usePdreRulesLazyQuery>;
export type PdreRulesSuspenseQueryHookResult = ReturnType<
  typeof usePdreRulesSuspenseQuery
>;
export type PdreRulesQueryResult = Apollo.QueryResult<
  PdreRulesQuery,
  PdreRulesQueryVariables
>;
export const UpdatePdreSettingsDocument = gql`
  mutation updatePdreSettings($input: PdOrgSettingsInput!) {
    pdOrgSettingsUpdate(input: $input) {
      id
      ...PdreSettings
    }
  }
  ${PdreSettingsFragmentDoc}
`;
export type UpdatePdreSettingsMutationFn = Apollo.MutationFunction<
  UpdatePdreSettingsMutation,
  UpdatePdreSettingsMutationVariables
>;

/**
 * __useUpdatePdreSettingsMutation__
 *
 * To run a mutation, you first call `useUpdatePdreSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePdreSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePdreSettingsMutation, { data, loading, error }] = useUpdatePdreSettingsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePdreSettingsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdatePdreSettingsMutation,
    UpdatePdreSettingsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdatePdreSettingsMutation,
    UpdatePdreSettingsMutationVariables
  >(UpdatePdreSettingsDocument, options);
}
export type UpdatePdreSettingsMutationHookResult = ReturnType<
  typeof useUpdatePdreSettingsMutation
>;
export type UpdatePdreSettingsMutationResult =
  Apollo.MutationResult<UpdatePdreSettingsMutation>;
export type UpdatePdreSettingsMutationOptions = Apollo.BaseMutationOptions<
  UpdatePdreSettingsMutation,
  UpdatePdreSettingsMutationVariables
>;
export const PdreSettingsDocument = gql`
  query PdreSettings {
    settings: pdOrgSettings {
      id
      ...PdreSettings
    }
  }
  ${PdreSettingsFragmentDoc}
`;

/**
 * __usePdreSettingsQuery__
 *
 * To run a query within a React component, call `usePdreSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePdreSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePdreSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function usePdreSettingsQuery(
  baseOptions?: Apollo.QueryHookOptions<PdreSettingsQuery, PdreSettingsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PdreSettingsQuery, PdreSettingsQueryVariables>(
    PdreSettingsDocument,
    options
  );
}
export function usePdreSettingsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PdreSettingsQuery, PdreSettingsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PdreSettingsQuery, PdreSettingsQueryVariables>(
    PdreSettingsDocument,
    options
  );
}
export function usePdreSettingsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    PdreSettingsQuery,
    PdreSettingsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<PdreSettingsQuery, PdreSettingsQueryVariables>(
    PdreSettingsDocument,
    options
  );
}
export type PdreSettingsQueryHookResult = ReturnType<typeof usePdreSettingsQuery>;
export type PdreSettingsLazyQueryHookResult = ReturnType<typeof usePdreSettingsLazyQuery>;
export type PdreSettingsSuspenseQueryHookResult = ReturnType<
  typeof usePdreSettingsSuspenseQuery
>;
export type PdreSettingsQueryResult = Apollo.QueryResult<
  PdreSettingsQuery,
  PdreSettingsQueryVariables
>;
export const CreateSiteDocument = gql`
  mutation createSite($input: SiteCreateInput!) {
    siteCreateV2(input: $input) {
      ...Site
    }
  }
  ${SiteFragmentDoc}
`;
export type CreateSiteMutationFn = Apollo.MutationFunction<
  CreateSiteMutation,
  CreateSiteMutationVariables
>;

/**
 * __useCreateSiteMutation__
 *
 * To run a mutation, you first call `useCreateSiteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSiteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSiteMutation, { data, loading, error }] = useCreateSiteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSiteMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateSiteMutation,
    CreateSiteMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateSiteMutation, CreateSiteMutationVariables>(
    CreateSiteDocument,
    options
  );
}
export type CreateSiteMutationHookResult = ReturnType<typeof useCreateSiteMutation>;
export type CreateSiteMutationResult = Apollo.MutationResult<CreateSiteMutation>;
export type CreateSiteMutationOptions = Apollo.BaseMutationOptions<
  CreateSiteMutation,
  CreateSiteMutationVariables
>;
export const UpdateSiteDocument = gql`
  mutation updateSite($id: ID!, $site: SiteUpdate!) {
    siteUpdate(idV2: $id, site: $site) {
      ...Site
    }
  }
  ${SiteFragmentDoc}
`;
export type UpdateSiteMutationFn = Apollo.MutationFunction<
  UpdateSiteMutation,
  UpdateSiteMutationVariables
>;

/**
 * __useUpdateSiteMutation__
 *
 * To run a mutation, you first call `useUpdateSiteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSiteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSiteMutation, { data, loading, error }] = useUpdateSiteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      site: // value for 'site'
 *   },
 * });
 */
export function useUpdateSiteMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateSiteMutation,
    UpdateSiteMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateSiteMutation, UpdateSiteMutationVariables>(
    UpdateSiteDocument,
    options
  );
}
export type UpdateSiteMutationHookResult = ReturnType<typeof useUpdateSiteMutation>;
export type UpdateSiteMutationResult = Apollo.MutationResult<UpdateSiteMutation>;
export type UpdateSiteMutationOptions = Apollo.BaseMutationOptions<
  UpdateSiteMutation,
  UpdateSiteMutationVariables
>;
export const DeleteSiteDocument = gql`
  mutation deleteSite($id: ID!) {
    siteDelete(idV2: $id)
  }
`;
export type DeleteSiteMutationFn = Apollo.MutationFunction<
  DeleteSiteMutation,
  DeleteSiteMutationVariables
>;

/**
 * __useDeleteSiteMutation__
 *
 * To run a mutation, you first call `useDeleteSiteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSiteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSiteMutation, { data, loading, error }] = useDeleteSiteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSiteMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteSiteMutation,
    DeleteSiteMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteSiteMutation, DeleteSiteMutationVariables>(
    DeleteSiteDocument,
    options
  );
}
export type DeleteSiteMutationHookResult = ReturnType<typeof useDeleteSiteMutation>;
export type DeleteSiteMutationResult = Apollo.MutationResult<DeleteSiteMutation>;
export type DeleteSiteMutationOptions = Apollo.BaseMutationOptions<
  DeleteSiteMutation,
  DeleteSiteMutationVariables
>;
export const GetSitesDocument = gql`
  query getSites {
    sites {
      ...Site
    }
  }
  ${SiteFragmentDoc}
`;

/**
 * __useGetSitesQuery__
 *
 * To run a query within a React component, call `useGetSitesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSitesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSitesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSitesQuery(
  baseOptions?: Apollo.QueryHookOptions<GetSitesQuery, GetSitesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetSitesQuery, GetSitesQueryVariables>(
    GetSitesDocument,
    options
  );
}
export function useGetSitesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetSitesQuery, GetSitesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetSitesQuery, GetSitesQueryVariables>(
    GetSitesDocument,
    options
  );
}
export function useGetSitesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GetSitesQuery, GetSitesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetSitesQuery, GetSitesQueryVariables>(
    GetSitesDocument,
    options
  );
}
export type GetSitesQueryHookResult = ReturnType<typeof useGetSitesQuery>;
export type GetSitesLazyQueryHookResult = ReturnType<typeof useGetSitesLazyQuery>;
export type GetSitesSuspenseQueryHookResult = ReturnType<typeof useGetSitesSuspenseQuery>;
export type GetSitesQueryResult = Apollo.QueryResult<
  GetSitesQuery,
  GetSitesQueryVariables
>;
export const NativeHostIdsForSiteDocument = gql`
  query nativeHostIdsForSite($siteId: Int!) {
    site(id: $siteId) {
      id: idV2
      name
      pdNativeHostIds
    }
  }
`;

/**
 * __useNativeHostIdsForSiteQuery__
 *
 * To run a query within a React component, call `useNativeHostIdsForSiteQuery` and pass it any options that fit your needs.
 * When your component renders, `useNativeHostIdsForSiteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNativeHostIdsForSiteQuery({
 *   variables: {
 *      siteId: // value for 'siteId'
 *   },
 * });
 */
export function useNativeHostIdsForSiteQuery(
  baseOptions: Apollo.QueryHookOptions<
    NativeHostIdsForSiteQuery,
    NativeHostIdsForSiteQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<NativeHostIdsForSiteQuery, NativeHostIdsForSiteQueryVariables>(
    NativeHostIdsForSiteDocument,
    options
  );
}
export function useNativeHostIdsForSiteLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    NativeHostIdsForSiteQuery,
    NativeHostIdsForSiteQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    NativeHostIdsForSiteQuery,
    NativeHostIdsForSiteQueryVariables
  >(NativeHostIdsForSiteDocument, options);
}
export function useNativeHostIdsForSiteSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    NativeHostIdsForSiteQuery,
    NativeHostIdsForSiteQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    NativeHostIdsForSiteQuery,
    NativeHostIdsForSiteQueryVariables
  >(NativeHostIdsForSiteDocument, options);
}
export type NativeHostIdsForSiteQueryHookResult = ReturnType<
  typeof useNativeHostIdsForSiteQuery
>;
export type NativeHostIdsForSiteLazyQueryHookResult = ReturnType<
  typeof useNativeHostIdsForSiteLazyQuery
>;
export type NativeHostIdsForSiteSuspenseQueryHookResult = ReturnType<
  typeof useNativeHostIdsForSiteSuspenseQuery
>;
export type NativeHostIdsForSiteQueryResult = Apollo.QueryResult<
  NativeHostIdsForSiteQuery,
  NativeHostIdsForSiteQueryVariables
>;
export const ApplicationSubscriptionsDocument = gql`
  query applicationSubscriptions {
    appSubscriptions: applications {
      ...AppSubscription
    }
  }
  ${AppSubscriptionFragmentDoc}
`;

/**
 * __useApplicationSubscriptionsQuery__
 *
 * To run a query within a React component, call `useApplicationSubscriptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useApplicationSubscriptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApplicationSubscriptionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useApplicationSubscriptionsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    ApplicationSubscriptionsQuery,
    ApplicationSubscriptionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    ApplicationSubscriptionsQuery,
    ApplicationSubscriptionsQueryVariables
  >(ApplicationSubscriptionsDocument, options);
}
export function useApplicationSubscriptionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ApplicationSubscriptionsQuery,
    ApplicationSubscriptionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    ApplicationSubscriptionsQuery,
    ApplicationSubscriptionsQueryVariables
  >(ApplicationSubscriptionsDocument, options);
}
export function useApplicationSubscriptionsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ApplicationSubscriptionsQuery,
    ApplicationSubscriptionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    ApplicationSubscriptionsQuery,
    ApplicationSubscriptionsQueryVariables
  >(ApplicationSubscriptionsDocument, options);
}
export type ApplicationSubscriptionsQueryHookResult = ReturnType<
  typeof useApplicationSubscriptionsQuery
>;
export type ApplicationSubscriptionsLazyQueryHookResult = ReturnType<
  typeof useApplicationSubscriptionsLazyQuery
>;
export type ApplicationSubscriptionsSuspenseQueryHookResult = ReturnType<
  typeof useApplicationSubscriptionsSuspenseQuery
>;
export type ApplicationSubscriptionsQueryResult = Apollo.QueryResult<
  ApplicationSubscriptionsQuery,
  ApplicationSubscriptionsQueryVariables
>;
export const UserProfileUpdateDocument = gql`
  mutation userProfileUpdate($user: UserProfileInput!) {
    userProfileUpdate(user: $user) {
      ...GaUser
    }
  }
  ${GaUserFragmentDoc}
`;
export type UserProfileUpdateMutationFn = Apollo.MutationFunction<
  UserProfileUpdateMutation,
  UserProfileUpdateMutationVariables
>;

/**
 * __useUserProfileUpdateMutation__
 *
 * To run a mutation, you first call `useUserProfileUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserProfileUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userProfileUpdateMutation, { data, loading, error }] = useUserProfileUpdateMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useUserProfileUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UserProfileUpdateMutation,
    UserProfileUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UserProfileUpdateMutation,
    UserProfileUpdateMutationVariables
  >(UserProfileUpdateDocument, options);
}
export type UserProfileUpdateMutationHookResult = ReturnType<
  typeof useUserProfileUpdateMutation
>;
export type UserProfileUpdateMutationResult =
  Apollo.MutationResult<UserProfileUpdateMutation>;
export type UserProfileUpdateMutationOptions = Apollo.BaseMutationOptions<
  UserProfileUpdateMutation,
  UserProfileUpdateMutationVariables
>;
export const UserPasswordResetDocument = gql`
  mutation userPasswordReset($user: UserPasswordResetInput!) {
    userPasswordReset(user: $user)
  }
`;
export type UserPasswordResetMutationFn = Apollo.MutationFunction<
  UserPasswordResetMutation,
  UserPasswordResetMutationVariables
>;

/**
 * __useUserPasswordResetMutation__
 *
 * To run a mutation, you first call `useUserPasswordResetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserPasswordResetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userPasswordResetMutation, { data, loading, error }] = useUserPasswordResetMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useUserPasswordResetMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UserPasswordResetMutation,
    UserPasswordResetMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UserPasswordResetMutation,
    UserPasswordResetMutationVariables
  >(UserPasswordResetDocument, options);
}
export type UserPasswordResetMutationHookResult = ReturnType<
  typeof useUserPasswordResetMutation
>;
export type UserPasswordResetMutationResult =
  Apollo.MutationResult<UserPasswordResetMutation>;
export type UserPasswordResetMutationOptions = Apollo.BaseMutationOptions<
  UserPasswordResetMutation,
  UserPasswordResetMutationVariables
>;
export const EmailExistsDocument = gql`
  query emailExists($email: String!) {
    emailExists(email: $email)
  }
`;

/**
 * __useEmailExistsQuery__
 *
 * To run a query within a React component, call `useEmailExistsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEmailExistsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEmailExistsQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useEmailExistsQuery(
  baseOptions: Apollo.QueryHookOptions<EmailExistsQuery, EmailExistsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<EmailExistsQuery, EmailExistsQueryVariables>(
    EmailExistsDocument,
    options
  );
}
export function useEmailExistsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<EmailExistsQuery, EmailExistsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<EmailExistsQuery, EmailExistsQueryVariables>(
    EmailExistsDocument,
    options
  );
}
export function useEmailExistsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    EmailExistsQuery,
    EmailExistsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<EmailExistsQuery, EmailExistsQueryVariables>(
    EmailExistsDocument,
    options
  );
}
export type EmailExistsQueryHookResult = ReturnType<typeof useEmailExistsQuery>;
export type EmailExistsLazyQueryHookResult = ReturnType<typeof useEmailExistsLazyQuery>;
export type EmailExistsSuspenseQueryHookResult = ReturnType<
  typeof useEmailExistsSuspenseQuery
>;
export type EmailExistsQueryResult = Apollo.QueryResult<
  EmailExistsQuery,
  EmailExistsQueryVariables
>;
export const CurrentUserMfaDocument = gql`
  query currentUserMfa {
    currentUser {
      ...GaCurrentUserMfa
    }
  }
  ${GaCurrentUserMfaFragmentDoc}
`;

/**
 * __useCurrentUserMfaQuery__
 *
 * To run a query within a React component, call `useCurrentUserMfaQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserMfaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserMfaQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserMfaQuery(
  baseOptions?: Apollo.QueryHookOptions<CurrentUserMfaQuery, CurrentUserMfaQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CurrentUserMfaQuery, CurrentUserMfaQueryVariables>(
    CurrentUserMfaDocument,
    options
  );
}
export function useCurrentUserMfaLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CurrentUserMfaQuery,
    CurrentUserMfaQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CurrentUserMfaQuery, CurrentUserMfaQueryVariables>(
    CurrentUserMfaDocument,
    options
  );
}
export function useCurrentUserMfaSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    CurrentUserMfaQuery,
    CurrentUserMfaQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<CurrentUserMfaQuery, CurrentUserMfaQueryVariables>(
    CurrentUserMfaDocument,
    options
  );
}
export type CurrentUserMfaQueryHookResult = ReturnType<typeof useCurrentUserMfaQuery>;
export type CurrentUserMfaLazyQueryHookResult = ReturnType<
  typeof useCurrentUserMfaLazyQuery
>;
export type CurrentUserMfaSuspenseQueryHookResult = ReturnType<
  typeof useCurrentUserMfaSuspenseQuery
>;
export type CurrentUserMfaQueryResult = Apollo.QueryResult<
  CurrentUserMfaQuery,
  CurrentUserMfaQueryVariables
>;
export const CurrentUserDocument = gql`
  query currentUser {
    currentUser {
      ...GaUser
    }
  }
  ${GaUserFragmentDoc}
`;

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(
  baseOptions?: Apollo.QueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(
    CurrentUserDocument,
    options
  );
}
export function useCurrentUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(
    CurrentUserDocument,
    options
  );
}
export function useCurrentUserSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    CurrentUserQuery,
    CurrentUserQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<CurrentUserQuery, CurrentUserQueryVariables>(
    CurrentUserDocument,
    options
  );
}
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<typeof useCurrentUserLazyQuery>;
export type CurrentUserSuspenseQueryHookResult = ReturnType<
  typeof useCurrentUserSuspenseQuery
>;
export type CurrentUserQueryResult = Apollo.QueryResult<
  CurrentUserQuery,
  CurrentUserQueryVariables
>;
