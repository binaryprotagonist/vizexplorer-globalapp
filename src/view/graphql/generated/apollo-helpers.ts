import {
  FieldPolicy,
  FieldReadFunction,
  TypePolicies,
  TypePolicy
} from "@apollo/client/cache";
export type AddressKeySpecifier = (
  | "city"
  | "country"
  | "phone"
  | "postalCode"
  | "region"
  | "street1"
  | "street2"
  | AddressKeySpecifier
)[];
export type AddressFieldPolicy = {
  city?: FieldPolicy<any> | FieldReadFunction<any>;
  country?: FieldPolicy<any> | FieldReadFunction<any>;
  phone?: FieldPolicy<any> | FieldReadFunction<any>;
  postalCode?: FieldPolicy<any> | FieldReadFunction<any>;
  region?: FieldPolicy<any> | FieldReadFunction<any>;
  street1?: FieldPolicy<any> | FieldReadFunction<any>;
  street2?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type AppRoleKeySpecifier = ("id" | "name" | AppRoleKeySpecifier)[];
export type AppRoleFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type AppSubscriptionKeySpecifier = (
  | "id"
  | "isOnprem"
  | "isValid"
  | "maxSlots"
  | "package"
  | "periodEndDate"
  | "periodStartDate"
  | "slotsTierUpperRange"
  | "status"
  | AppSubscriptionKeySpecifier
)[];
export type AppSubscriptionFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  isOnprem?: FieldPolicy<any> | FieldReadFunction<any>;
  isValid?: FieldPolicy<any> | FieldReadFunction<any>;
  maxSlots?: FieldPolicy<any> | FieldReadFunction<any>;
  package?: FieldPolicy<any> | FieldReadFunction<any>;
  periodEndDate?: FieldPolicy<any> | FieldReadFunction<any>;
  periodStartDate?: FieldPolicy<any> | FieldReadFunction<any>;
  slotsTierUpperRange?: FieldPolicy<any> | FieldReadFunction<any>;
  status?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ApplicationKeySpecifier = (
  | "accessList"
  | "dataSourceEnabled"
  | "fullName"
  | "hasAccess"
  | "icon"
  | "id"
  | "name"
  | "roles"
  | "sites"
  | "status"
  | "subscription"
  | "url"
  | ApplicationKeySpecifier
)[];
export type ApplicationFieldPolicy = {
  accessList?: FieldPolicy<any> | FieldReadFunction<any>;
  dataSourceEnabled?: FieldPolicy<any> | FieldReadFunction<any>;
  fullName?: FieldPolicy<any> | FieldReadFunction<any>;
  hasAccess?: FieldPolicy<any> | FieldReadFunction<any>;
  icon?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  roles?: FieldPolicy<any> | FieldReadFunction<any>;
  sites?: FieldPolicy<any> | FieldReadFunction<any>;
  status?: FieldPolicy<any> | FieldReadFunction<any>;
  subscription?: FieldPolicy<any> | FieldReadFunction<any>;
  url?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ApplicationSubscriptionKeySpecifier = (
  | "application"
  | "dataAdapter"
  | "id"
  | "inFirstPeriod"
  | "inTrial"
  | "payment"
  | "periodEndDate"
  | "periodStartDate"
  | "plan"
  | "slots"
  | "status"
  | "subtotal"
  | ApplicationSubscriptionKeySpecifier
)[];
export type ApplicationSubscriptionFieldPolicy = {
  application?: FieldPolicy<any> | FieldReadFunction<any>;
  dataAdapter?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  inFirstPeriod?: FieldPolicy<any> | FieldReadFunction<any>;
  inTrial?: FieldPolicy<any> | FieldReadFunction<any>;
  payment?: FieldPolicy<any> | FieldReadFunction<any>;
  periodEndDate?: FieldPolicy<any> | FieldReadFunction<any>;
  periodStartDate?: FieldPolicy<any> | FieldReadFunction<any>;
  plan?: FieldPolicy<any> | FieldReadFunction<any>;
  slots?: FieldPolicy<any> | FieldReadFunction<any>;
  status?: FieldPolicy<any> | FieldReadFunction<any>;
  subtotal?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type CommunicationSettingsKeySpecifier = (
  | "allowsCalling"
  | "allowsEmailing"
  | "allowsTexting"
  | CommunicationSettingsKeySpecifier
)[];
export type CommunicationSettingsFieldPolicy = {
  allowsCalling?: FieldPolicy<any> | FieldReadFunction<any>;
  allowsEmailing?: FieldPolicy<any> | FieldReadFunction<any>;
  allowsTexting?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type CompanyKeySpecifier = (
  | "address"
  | "config"
  | "email"
  | "id"
  | "name"
  | "subscription"
  | CompanyKeySpecifier
)[];
export type CompanyFieldPolicy = {
  address?: FieldPolicy<any> | FieldReadFunction<any>;
  config?: FieldPolicy<any> | FieldReadFunction<any>;
  email?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  subscription?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ConfigKeySpecifier = ("maxSlots" | "multiProperties" | ConfigKeySpecifier)[];
export type ConfigFieldPolicy = {
  maxSlots?: FieldPolicy<any> | FieldReadFunction<any>;
  multiProperties?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type CurrencyKeySpecifier = ("code" | CurrencyKeySpecifier)[];
export type CurrencyFieldPolicy = {
  code?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type DataAdapterKeySpecifier = ("id" | "stageDb" | DataAdapterKeySpecifier)[];
export type DataAdapterFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  stageDb?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type DataAdapterStageDbKeySpecifier = (
  | "databaseName"
  | "host"
  | "password"
  | "port"
  | "username"
  | DataAdapterStageDbKeySpecifier
)[];
export type DataAdapterStageDbFieldPolicy = {
  databaseName?: FieldPolicy<any> | FieldReadFunction<any>;
  host?: FieldPolicy<any> | FieldReadFunction<any>;
  password?: FieldPolicy<any> | FieldReadFunction<any>;
  port?: FieldPolicy<any> | FieldReadFunction<any>;
  username?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type DataFeedStatusKeySpecifier = (
  | "maxDate"
  | "sourceSiteIds"
  | DataFeedStatusKeySpecifier
)[];
export type DataFeedStatusFieldPolicy = {
  maxDate?: FieldPolicy<any> | FieldReadFunction<any>;
  sourceSiteIds?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type DiscoveryKeySpecifier = ("auth" | "env" | DiscoveryKeySpecifier)[];
export type DiscoveryFieldPolicy = {
  auth?: FieldPolicy<any> | FieldReadFunction<any>;
  env?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type EnvKeySpecifier = (
  | "onPrem"
  | "remainingDays"
  | "updateChecker"
  | "versions"
  | EnvKeySpecifier
)[];
export type EnvFieldPolicy = {
  onPrem?: FieldPolicy<any> | FieldReadFunction<any>;
  remainingDays?: FieldPolicy<any> | FieldReadFunction<any>;
  updateChecker?: FieldPolicy<any> | FieldReadFunction<any>;
  versions?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type FeedSiteMappingKeySpecifier = (
  | "id"
  | "sourceSiteId"
  | FeedSiteMappingKeySpecifier
)[];
export type FeedSiteMappingFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  sourceSiteId?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type GuestAttributeKeySpecifier = (
  | "kind"
  | "value"
  | GuestAttributeKeySpecifier
)[];
export type GuestAttributeFieldPolicy = {
  kind?: FieldPolicy<any> | FieldReadFunction<any>;
  value?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type HeatMapKeySpecifier = (
  | "attributes"
  | "id"
  | "uploadedAt"
  | HeatMapKeySpecifier
)[];
export type HeatMapFieldPolicy = {
  attributes?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  uploadedAt?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type KeycloakKeySpecifier = (
  | "authServerUrl"
  | "clientId"
  | "realm"
  | KeycloakKeySpecifier
)[];
export type KeycloakFieldPolicy = {
  authServerUrl?: FieldPolicy<any> | FieldReadFunction<any>;
  clientId?: FieldPolicy<any> | FieldReadFunction<any>;
  realm?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type LicenseKeySpecifier = ("required" | "status" | LicenseKeySpecifier)[];
export type LicenseFieldPolicy = {
  required?: FieldPolicy<any> | FieldReadFunction<any>;
  status?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type LicenseErrorKeySpecifier = ("code" | "message" | LicenseErrorKeySpecifier)[];
export type LicenseErrorFieldPolicy = {
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  message?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type LicenseStatusKeySpecifier = (
  | "error"
  | "isValid"
  | LicenseStatusKeySpecifier
)[];
export type LicenseStatusFieldPolicy = {
  error?: FieldPolicy<any> | FieldReadFunction<any>;
  isValid?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type LicenseVerificationKeySpecifier = (
  | "app"
  | "sisense"
  | "sisenseDataObject"
  | LicenseVerificationKeySpecifier
)[];
export type LicenseVerificationFieldPolicy = {
  app?: FieldPolicy<any> | FieldReadFunction<any>;
  sisense?: FieldPolicy<any> | FieldReadFunction<any>;
  sisenseDataObject?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type MutationKeySpecifier = (
  | "companyUpdate"
  | "dangerWebPushSend"
  | "dataAdapterDisable"
  | "dataAdapterEnable"
  | "feedSiteMappingUpdate"
  | "licenseUpdate"
  | "nativeSiteMappingUpdate"
  | "noAccessUserCreate"
  | "odrDashboardReset"
  | "odrDashboardsExport"
  | "odrDataConnectorCreate"
  | "odrDataConnectorUpdate"
  | "odrDataSourceUpdate"
  | "odrJobCancel"
  | "orgCreate"
  | "orgDataAdapterDelete"
  | "orgDataSourcesDelete"
  | "orgDelete"
  | "orgFeaturesUpdate"
  | "orgHeatmapAdd"
  | "orgHeatmapDelete"
  | "orgLicenseCreate"
  | "orgLicenseDisable"
  | "orgLicenseEnable"
  | "orgLicenseUpdate"
  | "orgSitesDelete"
  | "orgUsersDelete"
  | "pdGoalProgramCreate"
  | "pdGoalProgramDelete"
  | "pdGoalProgramUpdate"
  | "pdGreetRuleCreate"
  | "pdGreetRuleDelete"
  | "pdGreetRuleUpdate"
  | "pdGreetRulesPriorityUpdate"
  | "pdGreetSettingsUpdate"
  | "pdGreetStatusUpdate"
  | "pdGuestCommunicate"
  | "pdHostGreeterStatusUpdate"
  | "pdHostMappingUpdate"
  | "pdLayoutUpdate"
  | "pdLayoutV2Update"
  | "pdMarketingProgramDelete"
  | "pdOrgSettingsUpdate"
  | "pdRuleConfigUpdate"
  | "pdTaskComplete"
  | "pdTaskDismiss"
  | "pdTaskSnooze"
  | "pdTasksEngineRun"
  | "pdUserGroupCreate"
  | "pdUserGroupDelete"
  | "pdUserGroupUpdate"
  | "siteCreateV2"
  | "siteDelete"
  | "siteUpdate"
  | "subscriptionCreate"
  | "subscriptionCreateV2"
  | "subscriptionTerminate"
  | "subscriptionUpdate"
  | "sudoImpersonateOrg"
  | "sudoImpersonateOrgV2"
  | "sudoImpersonateUserV2"
  | "sudoImpersonateUserV3"
  | "userAccessUpdate"
  | "userAppAccessGrant"
  | "userAppAccessRevoke"
  | "userCreate"
  | "userCreateV2"
  | "userDelete"
  | "userPasswordReset"
  | "userProfileUpdate"
  | "userUpdate"
  | "webPushDeregister"
  | "webPushRegister"
  | MutationKeySpecifier
)[];
export type MutationFieldPolicy = {
  companyUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  dangerWebPushSend?: FieldPolicy<any> | FieldReadFunction<any>;
  dataAdapterDisable?: FieldPolicy<any> | FieldReadFunction<any>;
  dataAdapterEnable?: FieldPolicy<any> | FieldReadFunction<any>;
  feedSiteMappingUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  licenseUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  nativeSiteMappingUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  noAccessUserCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  odrDashboardReset?: FieldPolicy<any> | FieldReadFunction<any>;
  odrDashboardsExport?: FieldPolicy<any> | FieldReadFunction<any>;
  odrDataConnectorCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  odrDataConnectorUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  odrDataSourceUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  odrJobCancel?: FieldPolicy<any> | FieldReadFunction<any>;
  orgCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  orgDataAdapterDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  orgDataSourcesDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  orgDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  orgFeaturesUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  orgHeatmapAdd?: FieldPolicy<any> | FieldReadFunction<any>;
  orgHeatmapDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  orgLicenseCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  orgLicenseDisable?: FieldPolicy<any> | FieldReadFunction<any>;
  orgLicenseEnable?: FieldPolicy<any> | FieldReadFunction<any>;
  orgLicenseUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  orgSitesDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  orgUsersDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGoalProgramCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGoalProgramDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGoalProgramUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGreetRuleCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGreetRuleDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGreetRuleUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGreetRulesPriorityUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGreetSettingsUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGreetStatusUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGuestCommunicate?: FieldPolicy<any> | FieldReadFunction<any>;
  pdHostGreeterStatusUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  pdHostMappingUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  pdLayoutUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  pdLayoutV2Update?: FieldPolicy<any> | FieldReadFunction<any>;
  pdMarketingProgramDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  pdOrgSettingsUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  pdRuleConfigUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  pdTaskComplete?: FieldPolicy<any> | FieldReadFunction<any>;
  pdTaskDismiss?: FieldPolicy<any> | FieldReadFunction<any>;
  pdTaskSnooze?: FieldPolicy<any> | FieldReadFunction<any>;
  pdTasksEngineRun?: FieldPolicy<any> | FieldReadFunction<any>;
  pdUserGroupCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  pdUserGroupDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  pdUserGroupUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  siteCreateV2?: FieldPolicy<any> | FieldReadFunction<any>;
  siteDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  siteUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  subscriptionCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  subscriptionCreateV2?: FieldPolicy<any> | FieldReadFunction<any>;
  subscriptionTerminate?: FieldPolicy<any> | FieldReadFunction<any>;
  subscriptionUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  sudoImpersonateOrg?: FieldPolicy<any> | FieldReadFunction<any>;
  sudoImpersonateOrgV2?: FieldPolicy<any> | FieldReadFunction<any>;
  sudoImpersonateUserV2?: FieldPolicy<any> | FieldReadFunction<any>;
  sudoImpersonateUserV3?: FieldPolicy<any> | FieldReadFunction<any>;
  userAccessUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  userAppAccessGrant?: FieldPolicy<any> | FieldReadFunction<any>;
  userAppAccessRevoke?: FieldPolicy<any> | FieldReadFunction<any>;
  userCreate?: FieldPolicy<any> | FieldReadFunction<any>;
  userCreateV2?: FieldPolicy<any> | FieldReadFunction<any>;
  userDelete?: FieldPolicy<any> | FieldReadFunction<any>;
  userPasswordReset?: FieldPolicy<any> | FieldReadFunction<any>;
  userProfileUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  userUpdate?: FieldPolicy<any> | FieldReadFunction<any>;
  webPushDeregister?: FieldPolicy<any> | FieldReadFunction<any>;
  webPushRegister?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type NativeSiteMappingKeySpecifier = (
  | "id"
  | "nativeSiteId"
  | "slotMaxDate"
  | NativeSiteMappingKeySpecifier
)[];
export type NativeSiteMappingFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  nativeSiteId?: FieldPolicy<any> | FieldReadFunction<any>;
  slotMaxDate?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrBuildJobKeySpecifier = (
  | "accumulationId"
  | "appId"
  | "id"
  | "site"
  | "status"
  | OdrBuildJobKeySpecifier
)[];
export type OdrBuildJobFieldPolicy = {
  accumulationId?: FieldPolicy<any> | FieldReadFunction<any>;
  appId?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  site?: FieldPolicy<any> | FieldReadFunction<any>;
  status?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrBuildJobStatusKeySpecifier = (
  | "error"
  | "finished"
  | OdrBuildJobStatusKeySpecifier
)[];
export type OdrBuildJobStatusFieldPolicy = {
  error?: FieldPolicy<any> | FieldReadFunction<any>;
  finished?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrDashboardKeySpecifier = (
  | "dateRange"
  | "filters"
  | "filtersBySite"
  | "id"
  | "title"
  | "widgets"
  | OdrDashboardKeySpecifier
)[];
export type OdrDashboardFieldPolicy = {
  dateRange?: FieldPolicy<any> | FieldReadFunction<any>;
  filters?: FieldPolicy<any> | FieldReadFunction<any>;
  filtersBySite?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  title?: FieldPolicy<any> | FieldReadFunction<any>;
  widgets?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrDashboardBriefKeySpecifier = (
  | "id"
  | "title"
  | OdrDashboardBriefKeySpecifier
)[];
export type OdrDashboardBriefFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  title?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrDashboardDateRangeKeySpecifier = (
  | "max"
  | "min"
  | OdrDashboardDateRangeKeySpecifier
)[];
export type OdrDashboardDateRangeFieldPolicy = {
  max?: FieldPolicy<any> | FieldReadFunction<any>;
  min?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrDashboardFolderKeySpecifier = (
  | "appId"
  | "dashboards"
  | "dynamicElasticube"
  | "id"
  | "name"
  | "slotLatestBuild"
  | OdrDashboardFolderKeySpecifier
)[];
export type OdrDashboardFolderFieldPolicy = {
  appId?: FieldPolicy<any> | FieldReadFunction<any>;
  dashboards?: FieldPolicy<any> | FieldReadFunction<any>;
  dynamicElasticube?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  slotLatestBuild?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrDataConnectorKeySpecifier = (
  | "dataRefreshTime"
  | "hostVizSiteIds"
  | "id"
  | "name"
  | "params"
  | OdrDataConnectorKeySpecifier
)[];
export type OdrDataConnectorFieldPolicy = {
  dataRefreshTime?: FieldPolicy<any> | FieldReadFunction<any>;
  hostVizSiteIds?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  params?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrDataRefreshTimeKeySpecifier = (
  | "hour"
  | "minute"
  | "timezone"
  | OdrDataRefreshTimeKeySpecifier
)[];
export type OdrDataRefreshTimeFieldPolicy = {
  hour?: FieldPolicy<any> | FieldReadFunction<any>;
  minute?: FieldPolicy<any> | FieldReadFunction<any>;
  timezone?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrDataSourceKeySpecifier = (
  | "app"
  | "connector"
  | "connectorParams"
  | "id"
  | "site"
  | OdrDataSourceKeySpecifier
)[];
export type OdrDataSourceFieldPolicy = {
  app?: FieldPolicy<any> | FieldReadFunction<any>;
  connector?: FieldPolicy<any> | FieldReadFunction<any>;
  connectorParams?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  site?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrExportJobKeySpecifier = (
  | "appId"
  | "id"
  | "oneTimeLink"
  | "status"
  | OdrExportJobKeySpecifier
)[];
export type OdrExportJobFieldPolicy = {
  appId?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  oneTimeLink?: FieldPolicy<any> | FieldReadFunction<any>;
  status?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrExportStatusKeySpecifier = (
  | "canceled"
  | "error"
  | "finished"
  | "progress"
  | OdrExportStatusKeySpecifier
)[];
export type OdrExportStatusFieldPolicy = {
  canceled?: FieldPolicy<any> | FieldReadFunction<any>;
  error?: FieldPolicy<any> | FieldReadFunction<any>;
  finished?: FieldPolicy<any> | FieldReadFunction<any>;
  progress?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrFilterOptionsKeySpecifier = (
  | "hasMore"
  | "options"
  | OdrFilterOptionsKeySpecifier
)[];
export type OdrFilterOptionsFieldPolicy = {
  hasMore?: FieldPolicy<any> | FieldReadFunction<any>;
  options?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrHostVizParamsKeySpecifier = ("siteId" | OdrHostVizParamsKeySpecifier)[];
export type OdrHostVizParamsFieldPolicy = {
  siteId?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrJaqlValueConnectionKeySpecifier = (
  | "edges"
  | "nodes"
  | "pageInfo"
  | OdrJaqlValueConnectionKeySpecifier
)[];
export type OdrJaqlValueConnectionFieldPolicy = {
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  nodes?: FieldPolicy<any> | FieldReadFunction<any>;
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrJaqlValueEdgeKeySpecifier = (
  | "cursor"
  | "node"
  | OdrJaqlValueEdgeKeySpecifier
)[];
export type OdrJaqlValueEdgeFieldPolicy = {
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
  node?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrJaqlValueTypeKeySpecifier = (
  | "dataType"
  | "dateLevel"
  | OdrJaqlValueTypeKeySpecifier
)[];
export type OdrJaqlValueTypeFieldPolicy = {
  dataType?: FieldPolicy<any> | FieldReadFunction<any>;
  dateLevel?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrMssqlParamsKeySpecifier = (
  | "database"
  | "hostname"
  | "port"
  | "tlsEnabled"
  | "username"
  | OdrMssqlParamsKeySpecifier
)[];
export type OdrMssqlParamsFieldPolicy = {
  database?: FieldPolicy<any> | FieldReadFunction<any>;
  hostname?: FieldPolicy<any> | FieldReadFunction<any>;
  port?: FieldPolicy<any> | FieldReadFunction<any>;
  tlsEnabled?: FieldPolicy<any> | FieldReadFunction<any>;
  username?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrSimpleFilterKeySpecifier = (
  | "dim"
  | "max"
  | "min"
  | "options"
  | "optionsV2"
  | "title"
  | "valueType"
  | "values"
  | "variant"
  | OdrSimpleFilterKeySpecifier
)[];
export type OdrSimpleFilterFieldPolicy = {
  dim?: FieldPolicy<any> | FieldReadFunction<any>;
  max?: FieldPolicy<any> | FieldReadFunction<any>;
  min?: FieldPolicy<any> | FieldReadFunction<any>;
  options?: FieldPolicy<any> | FieldReadFunction<any>;
  optionsV2?: FieldPolicy<any> | FieldReadFunction<any>;
  title?: FieldPolicy<any> | FieldReadFunction<any>;
  valueType?: FieldPolicy<any> | FieldReadFunction<any>;
  values?: FieldPolicy<any> | FieldReadFunction<any>;
  variant?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrSiteFilterKeySpecifier = (
  | "dim"
  | "max"
  | "min"
  | "options"
  | "optionsV2"
  | "title"
  | "valueType"
  | "variant"
  | OdrSiteFilterKeySpecifier
)[];
export type OdrSiteFilterFieldPolicy = {
  dim?: FieldPolicy<any> | FieldReadFunction<any>;
  max?: FieldPolicy<any> | FieldReadFunction<any>;
  min?: FieldPolicy<any> | FieldReadFunction<any>;
  options?: FieldPolicy<any> | FieldReadFunction<any>;
  optionsV2?: FieldPolicy<any> | FieldReadFunction<any>;
  title?: FieldPolicy<any> | FieldReadFunction<any>;
  valueType?: FieldPolicy<any> | FieldReadFunction<any>;
  variant?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrSlotLatestBuildCsvUploadKeySpecifier = (
  | "accumulationId"
  | "lastGamingDate"
  | "maxDateRange"
  | "minDateRange"
  | "siteId"
  | OdrSlotLatestBuildCsvUploadKeySpecifier
)[];
export type OdrSlotLatestBuildCsvUploadFieldPolicy = {
  accumulationId?: FieldPolicy<any> | FieldReadFunction<any>;
  lastGamingDate?: FieldPolicy<any> | FieldReadFunction<any>;
  maxDateRange?: FieldPolicy<any> | FieldReadFunction<any>;
  minDateRange?: FieldPolicy<any> | FieldReadFunction<any>;
  siteId?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrSlotLatestBuildDataFeedKeySpecifier = (
  | "accumulationId"
  | "lastGamingDate"
  | "siteId"
  | OdrSlotLatestBuildDataFeedKeySpecifier
)[];
export type OdrSlotLatestBuildDataFeedFieldPolicy = {
  accumulationId?: FieldPolicy<any> | FieldReadFunction<any>;
  lastGamingDate?: FieldPolicy<any> | FieldReadFunction<any>;
  siteId?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrWidgetKeySpecifier = (
  | "id"
  | "reference"
  | "title"
  | "type"
  | OdrWidgetKeySpecifier
)[];
export type OdrWidgetFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  reference?: FieldPolicy<any> | FieldReadFunction<any>;
  title?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OdrWidgetReferenceKeySpecifier = (
  | "appId"
  | "dashboard"
  | "widget"
  | OdrWidgetReferenceKeySpecifier
)[];
export type OdrWidgetReferenceFieldPolicy = {
  appId?: FieldPolicy<any> | FieldReadFunction<any>;
  dashboard?: FieldPolicy<any> | FieldReadFunction<any>;
  widget?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OrgKeySpecifier = (
  | "company"
  | "dataAdapter"
  | "dataAdapterAllowed"
  | "dataAdapterEnabled"
  | "features"
  | "hasNativeSiteMappings"
  | "id"
  | "onPremTunnels"
  | "sites"
  | OrgKeySpecifier
)[];
export type OrgFieldPolicy = {
  company?: FieldPolicy<any> | FieldReadFunction<any>;
  dataAdapter?: FieldPolicy<any> | FieldReadFunction<any>;
  dataAdapterAllowed?: FieldPolicy<any> | FieldReadFunction<any>;
  dataAdapterEnabled?: FieldPolicy<any> | FieldReadFunction<any>;
  features?: FieldPolicy<any> | FieldReadFunction<any>;
  hasNativeSiteMappings?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  onPremTunnels?: FieldPolicy<any> | FieldReadFunction<any>;
  sites?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OrgAppKeySpecifier = (
  | "accessList"
  | "fullName"
  | "hasAccess"
  | "icon"
  | "id"
  | "isValid"
  | "name"
  | "url"
  | OrgAppKeySpecifier
)[];
export type OrgAppFieldPolicy = {
  accessList?: FieldPolicy<any> | FieldReadFunction<any>;
  fullName?: FieldPolicy<any> | FieldReadFunction<any>;
  hasAccess?: FieldPolicy<any> | FieldReadFunction<any>;
  icon?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  isValid?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  url?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OrgFeaturesKeySpecifier = ("multiProperties" | OrgFeaturesKeySpecifier)[];
export type OrgFeaturesFieldPolicy = {
  multiProperties?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OrgHeatMapKeySpecifier = (
  | "createdAt"
  | "effectiveFrom"
  | "floorId"
  | "heatMapId"
  | "id"
  | "mapUrl"
  | "sourceSiteId"
  | OrgHeatMapKeySpecifier
)[];
export type OrgHeatMapFieldPolicy = {
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  effectiveFrom?: FieldPolicy<any> | FieldReadFunction<any>;
  floorId?: FieldPolicy<any> | FieldReadFunction<any>;
  heatMapId?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  mapUrl?: FieldPolicy<any> | FieldReadFunction<any>;
  sourceSiteId?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OrgLicenseKeySpecifier = (
  | "expiresAt"
  | "id"
  | "issuedAt"
  | "key"
  | "lastVerifiedAt"
  | "lastVerifiedVersions"
  | OrgLicenseKeySpecifier
)[];
export type OrgLicenseFieldPolicy = {
  expiresAt?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  issuedAt?: FieldPolicy<any> | FieldReadFunction<any>;
  key?: FieldPolicy<any> | FieldReadFunction<any>;
  lastVerifiedAt?: FieldPolicy<any> | FieldReadFunction<any>;
  lastVerifiedVersions?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OrgOnPremTunnelKeySpecifier = ("url" | OrgOnPremTunnelKeySpecifier)[];
export type OrgOnPremTunnelFieldPolicy = {
  url?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PageInfoKeySpecifier = (
  | "endCursor"
  | "hasNextPage"
  | "hasPreviousPage"
  | "startCursor"
  | PageInfoKeySpecifier
)[];
export type PageInfoFieldPolicy = {
  endCursor?: FieldPolicy<any> | FieldReadFunction<any>;
  hasNextPage?: FieldPolicy<any> | FieldReadFunction<any>;
  hasPreviousPage?: FieldPolicy<any> | FieldReadFunction<any>;
  startCursor?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PaymentKeySpecifier = ("pastDue" | "pending" | PaymentKeySpecifier)[];
export type PaymentFieldPolicy = {
  pastDue?: FieldPolicy<any> | FieldReadFunction<any>;
  pending?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdBirthdayKeySpecifier = ("date" | PdBirthdayKeySpecifier)[];
export type PdBirthdayFieldPolicy = {
  date?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdEmailKeySpecifier = ("address" | PdEmailKeySpecifier)[];
export type PdEmailFieldPolicy = {
  address?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdEvaluationResultKeySpecifier = ("score" | PdEvaluationResultKeySpecifier)[];
export type PdEvaluationResultFieldPolicy = {
  score?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGoalProgramKeySpecifier = (
  | "createdAt"
  | "endDate"
  | "id"
  | "isCurrent"
  | "isFuture"
  | "members"
  | "metrics"
  | "modifiedAt"
  | "name"
  | "sisenseDashboardIndividualPerformance"
  | "sisenseDashboardTeamPerformance"
  | "site"
  | "startDate"
  | "status"
  | "targets"
  | PdGoalProgramKeySpecifier
)[];
export type PdGoalProgramFieldPolicy = {
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  endDate?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  isCurrent?: FieldPolicy<any> | FieldReadFunction<any>;
  isFuture?: FieldPolicy<any> | FieldReadFunction<any>;
  members?: FieldPolicy<any> | FieldReadFunction<any>;
  metrics?: FieldPolicy<any> | FieldReadFunction<any>;
  modifiedAt?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  sisenseDashboardIndividualPerformance?: FieldPolicy<any> | FieldReadFunction<any>;
  sisenseDashboardTeamPerformance?: FieldPolicy<any> | FieldReadFunction<any>;
  site?: FieldPolicy<any> | FieldReadFunction<any>;
  startDate?: FieldPolicy<any> | FieldReadFunction<any>;
  status?: FieldPolicy<any> | FieldReadFunction<any>;
  targets?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGoalProgramMetricKeySpecifier = (
  | "id"
  | "name"
  | "sisenseIndividualWidget"
  | "sisenseTeamWidget"
  | PdGoalProgramMetricKeySpecifier
)[];
export type PdGoalProgramMetricFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  sisenseIndividualWidget?: FieldPolicy<any> | FieldReadFunction<any>;
  sisenseTeamWidget?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGoalProgramTargetMatrixKeySpecifier = (
  | "matrix"
  | PdGoalProgramTargetMatrixKeySpecifier
)[];
export type PdGoalProgramTargetMatrixFieldPolicy = {
  matrix?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGreetKeySpecifier = (
  | "assetNumber"
  | "assignee"
  | "createdAt"
  | "guest"
  | "id"
  | "reason"
  | "ruleName"
  | "standId"
  | "status"
  | PdGreetKeySpecifier
)[];
export type PdGreetFieldPolicy = {
  assetNumber?: FieldPolicy<any> | FieldReadFunction<any>;
  assignee?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  guest?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  reason?: FieldPolicy<any> | FieldReadFunction<any>;
  ruleName?: FieldPolicy<any> | FieldReadFunction<any>;
  standId?: FieldPolicy<any> | FieldReadFunction<any>;
  status?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGreetMetricDefinitionKeySpecifier = (
  | "code"
  | "description"
  | "label"
  | "position"
  | "valueType"
  | PdGreetMetricDefinitionKeySpecifier
)[];
export type PdGreetMetricDefinitionFieldPolicy = {
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
  label?: FieldPolicy<any> | FieldReadFunction<any>;
  position?: FieldPolicy<any> | FieldReadFunction<any>;
  valueType?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGreetReportConfigKeySpecifier = (
  | "emailRecipients"
  | "enabled"
  | PdGreetReportConfigKeySpecifier
)[];
export type PdGreetReportConfigFieldPolicy = {
  emailRecipients?: FieldPolicy<any> | FieldReadFunction<any>;
  enabled?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGreetRuleKeySpecifier = (
  | "assignment"
  | "id"
  | "isEnabled"
  | "isIgnoreSuppression"
  | "name"
  | "priority"
  | "site"
  | "triggers"
  | PdGreetRuleKeySpecifier
)[];
export type PdGreetRuleFieldPolicy = {
  assignment?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  isEnabled?: FieldPolicy<any> | FieldReadFunction<any>;
  isIgnoreSuppression?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  priority?: FieldPolicy<any> | FieldReadFunction<any>;
  site?: FieldPolicy<any> | FieldReadFunction<any>;
  triggers?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGreetRuleAssignmentKeySpecifier = (
  | "assignTo"
  | "id"
  | "overflowAssignment"
  | "overflowAssignment2"
  | "weight"
  | PdGreetRuleAssignmentKeySpecifier
)[];
export type PdGreetRuleAssignmentFieldPolicy = {
  assignTo?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  overflowAssignment?: FieldPolicy<any> | FieldReadFunction<any>;
  overflowAssignment2?: FieldPolicy<any> | FieldReadFunction<any>;
  weight?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGreetRuleGroupAssignmentKeySpecifier = (
  | "assignmentToType"
  | "userGroup"
  | PdGreetRuleGroupAssignmentKeySpecifier
)[];
export type PdGreetRuleGroupAssignmentFieldPolicy = {
  assignmentToType?: FieldPolicy<any> | FieldReadFunction<any>;
  userGroup?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGreetRuleMetricTriggerKeySpecifier = (
  | "metric"
  | "operator"
  | "value"
  | PdGreetRuleMetricTriggerKeySpecifier
)[];
export type PdGreetRuleMetricTriggerFieldPolicy = {
  metric?: FieldPolicy<any> | FieldReadFunction<any>;
  operator?: FieldPolicy<any> | FieldReadFunction<any>;
  value?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGreetRuleSpecialTriggerKeySpecifier = (
  | "type"
  | "value"
  | PdGreetRuleSpecialTriggerKeySpecifier
)[];
export type PdGreetRuleSpecialTriggerFieldPolicy = {
  type?: FieldPolicy<any> | FieldReadFunction<any>;
  value?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGreetRuleSpecialTriggerValueKeySpecifier = (
  | "includeAll"
  | "valuesIn"
  | PdGreetRuleSpecialTriggerValueKeySpecifier
)[];
export type PdGreetRuleSpecialTriggerValueFieldPolicy = {
  includeAll?: FieldPolicy<any> | FieldReadFunction<any>;
  valuesIn?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGreetSectionKeySpecifier = (
  | "floor"
  | "section"
  | PdGreetSectionKeySpecifier
)[];
export type PdGreetSectionFieldPolicy = {
  floor?: FieldPolicy<any> | FieldReadFunction<any>;
  section?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGreetSettingsKeySpecifier = (
  | "greetAssignByPriorityScore"
  | "greetQueueInactiveTimeout"
  | "greetReassignmentTimeout"
  | "greetShowGuestActiveActions"
  | "greetSuppressionDays"
  | "guestReportBanned"
  | "hostAllowSuppression"
  | "hostEnableSections"
  | "hostMaxAssignments"
  | "hostMaxMissedGreets"
  | "id"
  | PdGreetSettingsKeySpecifier
)[];
export type PdGreetSettingsFieldPolicy = {
  greetAssignByPriorityScore?: FieldPolicy<any> | FieldReadFunction<any>;
  greetQueueInactiveTimeout?: FieldPolicy<any> | FieldReadFunction<any>;
  greetReassignmentTimeout?: FieldPolicy<any> | FieldReadFunction<any>;
  greetShowGuestActiveActions?: FieldPolicy<any> | FieldReadFunction<any>;
  greetSuppressionDays?: FieldPolicy<any> | FieldReadFunction<any>;
  guestReportBanned?: FieldPolicy<any> | FieldReadFunction<any>;
  hostAllowSuppression?: FieldPolicy<any> | FieldReadFunction<any>;
  hostEnableSections?: FieldPolicy<any> | FieldReadFunction<any>;
  hostMaxAssignments?: FieldPolicy<any> | FieldReadFunction<any>;
  hostMaxMissedGreets?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGreetSuppressionDaysKeySpecifier = (
  | "coded"
  | "uncoded"
  | PdGreetSuppressionDaysKeySpecifier
)[];
export type PdGreetSuppressionDaysFieldPolicy = {
  coded?: FieldPolicy<any> | FieldReadFunction<any>;
  uncoded?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGreetTimeoutKeySpecifier = (
  | "hours"
  | "minutes"
  | PdGreetTimeoutKeySpecifier
)[];
export type PdGreetTimeoutFieldPolicy = {
  hours?: FieldPolicy<any> | FieldReadFunction<any>;
  minutes?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGreeterStatusKeySpecifier = (
  | "available"
  | "availableAt"
  | "id"
  | "sectionAssignments"
  | "sectionEnabled"
  | PdGreeterStatusKeySpecifier
)[];
export type PdGreeterStatusFieldPolicy = {
  available?: FieldPolicy<any> | FieldReadFunction<any>;
  availableAt?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  sectionAssignments?: FieldPolicy<any> | FieldReadFunction<any>;
  sectionEnabled?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGuestActionKeySpecifier = (
  | "assignee"
  | "createdAt"
  | "id"
  | PdGuestActionKeySpecifier
)[];
export type PdGuestActionFieldPolicy = {
  assignee?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGuestAttributeConfigKeySpecifier = (
  | "enabled"
  | "kind"
  | PdGuestAttributeConfigKeySpecifier
)[];
export type PdGuestAttributeConfigFieldPolicy = {
  enabled?: FieldPolicy<any> | FieldReadFunction<any>;
  kind?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGuestCommunicationKeySpecifier = (
  | "communicatedAt"
  | "communicatedBy"
  | "guest"
  | "id"
  | "note"
  | "type"
  | PdGuestCommunicationKeySpecifier
)[];
export type PdGuestCommunicationFieldPolicy = {
  communicatedAt?: FieldPolicy<any> | FieldReadFunction<any>;
  communicatedBy?: FieldPolicy<any> | FieldReadFunction<any>;
  guest?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  note?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGuestCommunicationConnectionKeySpecifier = (
  | "edges"
  | "nodes"
  | "pageInfo"
  | PdGuestCommunicationConnectionKeySpecifier
)[];
export type PdGuestCommunicationConnectionFieldPolicy = {
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  nodes?: FieldPolicy<any> | FieldReadFunction<any>;
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGuestCommunicationEdgeKeySpecifier = (
  | "cursor"
  | "node"
  | PdGuestCommunicationEdgeKeySpecifier
)[];
export type PdGuestCommunicationEdgeFieldPolicy = {
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
  node?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGuestEventKeySpecifier = (
  | "eventTime"
  | "eventType"
  | "id"
  | "standId"
  | PdGuestEventKeySpecifier
)[];
export type PdGuestEventFieldPolicy = {
  eventTime?: FieldPolicy<any> | FieldReadFunction<any>;
  eventType?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  standId?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGuestLastContactKeySpecifier = (
  | "lastContactedAt"
  | PdGuestLastContactKeySpecifier
)[];
export type PdGuestLastContactFieldPolicy = {
  lastContactedAt?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdGuestMetricTableKeySpecifier = (
  | "columns"
  | "formats"
  | "guestIds"
  | "headers"
  | PdGuestMetricTableKeySpecifier
)[];
export type PdGuestMetricTableFieldPolicy = {
  columns?: FieldPolicy<any> | FieldReadFunction<any>;
  formats?: FieldPolicy<any> | FieldReadFunction<any>;
  guestIds?: FieldPolicy<any> | FieldReadFunction<any>;
  headers?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdHostKeySpecifier = (
  | "assignedGuestCount"
  | "firstName"
  | "goalPrograms"
  | "greeterStatus"
  | "id"
  | "isMappedToMe"
  | "lastName"
  | "recentCommunications"
  | PdHostKeySpecifier
)[];
export type PdHostFieldPolicy = {
  assignedGuestCount?: FieldPolicy<any> | FieldReadFunction<any>;
  firstName?: FieldPolicy<any> | FieldReadFunction<any>;
  goalPrograms?: FieldPolicy<any> | FieldReadFunction<any>;
  greeterStatus?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  isMappedToMe?: FieldPolicy<any> | FieldReadFunction<any>;
  lastName?: FieldPolicy<any> | FieldReadFunction<any>;
  recentCommunications?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdHostMappingKeySpecifier = (
  | "id"
  | "nativeHost"
  | "nativeHostId"
  | "siteId"
  | "user"
  | PdHostMappingKeySpecifier
)[];
export type PdHostMappingFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  nativeHost?: FieldPolicy<any> | FieldReadFunction<any>;
  nativeHostId?: FieldPolicy<any> | FieldReadFunction<any>;
  siteId?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdLastTripKeySpecifier = ("date" | PdLastTripKeySpecifier)[];
export type PdLastTripFieldPolicy = {
  date?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdLayoutKeySpecifier = ("id" | "layout" | PdLayoutKeySpecifier)[];
export type PdLayoutFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  layout?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdLayoutCustomComponentKeySpecifier = (
  | "dimensions"
  | "props"
  | "type"
  | PdLayoutCustomComponentKeySpecifier
)[];
export type PdLayoutCustomComponentFieldPolicy = {
  dimensions?: FieldPolicy<any> | FieldReadFunction<any>;
  props?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdLayoutGridStackKeySpecifier = (
  | "config"
  | "items"
  | "sisenseDashboard"
  | PdLayoutGridStackKeySpecifier
)[];
export type PdLayoutGridStackFieldPolicy = {
  config?: FieldPolicy<any> | FieldReadFunction<any>;
  items?: FieldPolicy<any> | FieldReadFunction<any>;
  sisenseDashboard?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdLayoutGridStackComponentKeySpecifier = (
  | "dimensions"
  | "props"
  | "type"
  | PdLayoutGridStackComponentKeySpecifier
)[];
export type PdLayoutGridStackComponentFieldPolicy = {
  dimensions?: FieldPolicy<any> | FieldReadFunction<any>;
  props?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdLayoutGridStackConfigKeySpecifier = (
  | "maxColumns"
  | PdLayoutGridStackConfigKeySpecifier
)[];
export type PdLayoutGridStackConfigFieldPolicy = {
  maxColumns?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdLayoutGridStackDimensionKeySpecifier = (
  | "h"
  | "w"
  | "x"
  | "y"
  | PdLayoutGridStackDimensionKeySpecifier
)[];
export type PdLayoutGridStackDimensionFieldPolicy = {
  h?: FieldPolicy<any> | FieldReadFunction<any>;
  w?: FieldPolicy<any> | FieldReadFunction<any>;
  x?: FieldPolicy<any> | FieldReadFunction<any>;
  y?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdLayoutSisenseComponentKeySpecifier = (
  | "dimensions"
  | "props"
  | "type"
  | PdLayoutSisenseComponentKeySpecifier
)[];
export type PdLayoutSisenseComponentFieldPolicy = {
  dimensions?: FieldPolicy<any> | FieldReadFunction<any>;
  props?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdLayoutSisenseDashboardReferenceKeySpecifier = (
  | "dashboard"
  | PdLayoutSisenseDashboardReferenceKeySpecifier
)[];
export type PdLayoutSisenseDashboardReferenceFieldPolicy = {
  dashboard?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdLayoutV2KeySpecifier = ("id" | "sections" | PdLayoutV2KeySpecifier)[];
export type PdLayoutV2FieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  sections?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdLayoutV2ComponentKeySpecifier = (
  | "componentType"
  | "widget"
  | PdLayoutV2ComponentKeySpecifier
)[];
export type PdLayoutV2ComponentFieldPolicy = {
  componentType?: FieldPolicy<any> | FieldReadFunction<any>;
  widget?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdLayoutV2ComponentListKeySpecifier = (
  | "components"
  | "type"
  | PdLayoutV2ComponentListKeySpecifier
)[];
export type PdLayoutV2ComponentListFieldPolicy = {
  components?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdLayoutV2CustomComponentKeySpecifier = (
  | "componentType"
  | "widget"
  | PdLayoutV2CustomComponentKeySpecifier
)[];
export type PdLayoutV2CustomComponentFieldPolicy = {
  componentType?: FieldPolicy<any> | FieldReadFunction<any>;
  widget?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdLayoutV2DualComponentKeySpecifier = (
  | "components"
  | "title"
  | PdLayoutV2DualComponentKeySpecifier
)[];
export type PdLayoutV2DualComponentFieldPolicy = {
  components?: FieldPolicy<any> | FieldReadFunction<any>;
  title?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdLayoutV2DualComponentListKeySpecifier = (
  | "components"
  | "type"
  | PdLayoutV2DualComponentListKeySpecifier
)[];
export type PdLayoutV2DualComponentListFieldPolicy = {
  components?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdLayoutV2RowKeySpecifier = (
  | "config"
  | "content"
  | PdLayoutV2RowKeySpecifier
)[];
export type PdLayoutV2RowFieldPolicy = {
  config?: FieldPolicy<any> | FieldReadFunction<any>;
  content?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdLayoutV2RowConfigKeySpecifier = (
  | "editable"
  | "sisenseWidgetType"
  | PdLayoutV2RowConfigKeySpecifier
)[];
export type PdLayoutV2RowConfigFieldPolicy = {
  editable?: FieldPolicy<any> | FieldReadFunction<any>;
  sisenseWidgetType?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdLayoutV2RowContentKeySpecifier = (
  | "type"
  | PdLayoutV2RowContentKeySpecifier
)[];
export type PdLayoutV2RowContentFieldPolicy = {
  type?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdLayoutV2SectionKeySpecifier = (
  | "header"
  | "hidden"
  | "id"
  | "name"
  | "rows"
  | "sisenseDashboard"
  | PdLayoutV2SectionKeySpecifier
)[];
export type PdLayoutV2SectionFieldPolicy = {
  header?: FieldPolicy<any> | FieldReadFunction<any>;
  hidden?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  rows?: FieldPolicy<any> | FieldReadFunction<any>;
  sisenseDashboard?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdLayoutV2SisenseWidgetKeySpecifier = (
  | "componentType"
  | "widget"
  | PdLayoutV2SisenseWidgetKeySpecifier
)[];
export type PdLayoutV2SisenseWidgetFieldPolicy = {
  componentType?: FieldPolicy<any> | FieldReadFunction<any>;
  widget?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdMarketingProgramKeySpecifier = (
  | "actionsCreated"
  | "createdBy"
  | "dueDate"
  | "guestsSelected"
  | "id"
  | "modifiedAt"
  | "name"
  | "startDate"
  | "status"
  | PdMarketingProgramKeySpecifier
)[];
export type PdMarketingProgramFieldPolicy = {
  actionsCreated?: FieldPolicy<any> | FieldReadFunction<any>;
  createdBy?: FieldPolicy<any> | FieldReadFunction<any>;
  dueDate?: FieldPolicy<any> | FieldReadFunction<any>;
  guestsSelected?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  modifiedAt?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  startDate?: FieldPolicy<any> | FieldReadFunction<any>;
  status?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdMarketingProgramActionReasonKeySpecifier = (
  | "id"
  | "name"
  | PdMarketingProgramActionReasonKeySpecifier
)[];
export type PdMarketingProgramActionReasonFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdMarketingProgramGuestListKeySpecifier = (
  | "guestCount"
  | "metricTable"
  | PdMarketingProgramGuestListKeySpecifier
)[];
export type PdMarketingProgramGuestListFieldPolicy = {
  guestCount?: FieldPolicy<any> | FieldReadFunction<any>;
  metricTable?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdMarketingProgramGuestMetricKeySpecifier = (
  | "dateRangeTypes"
  | "id"
  | "label"
  | PdMarketingProgramGuestMetricKeySpecifier
)[];
export type PdMarketingProgramGuestMetricFieldPolicy = {
  dateRangeTypes?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  label?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdNativeHostKeySpecifier = (
  | "firstName"
  | "lastName"
  | "nativeHostId"
  | "siteId"
  | PdNativeHostKeySpecifier
)[];
export type PdNativeHostFieldPolicy = {
  firstName?: FieldPolicy<any> | FieldReadFunction<any>;
  lastName?: FieldPolicy<any> | FieldReadFunction<any>;
  nativeHostId?: FieldPolicy<any> | FieldReadFunction<any>;
  siteId?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdOrgSettingsKeySpecifier = (
  | "guestAttributes"
  | "guestTimePeriods"
  | "hostSummaryTimePeriods"
  | "hostTimePeriods"
  | "id"
  | "lookbackDays"
  | "maxTasksPerHost"
  | "maxTasksPerView"
  | "taskScheduler"
  | "tiers"
  | "timePeriods"
  | "valueMetric"
  | "worthPercentage"
  | PdOrgSettingsKeySpecifier
)[];
export type PdOrgSettingsFieldPolicy = {
  guestAttributes?: FieldPolicy<any> | FieldReadFunction<any>;
  guestTimePeriods?: FieldPolicy<any> | FieldReadFunction<any>;
  hostSummaryTimePeriods?: FieldPolicy<any> | FieldReadFunction<any>;
  hostTimePeriods?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  lookbackDays?: FieldPolicy<any> | FieldReadFunction<any>;
  maxTasksPerHost?: FieldPolicy<any> | FieldReadFunction<any>;
  maxTasksPerView?: FieldPolicy<any> | FieldReadFunction<any>;
  taskScheduler?: FieldPolicy<any> | FieldReadFunction<any>;
  tiers?: FieldPolicy<any> | FieldReadFunction<any>;
  timePeriods?: FieldPolicy<any> | FieldReadFunction<any>;
  valueMetric?: FieldPolicy<any> | FieldReadFunction<any>;
  worthPercentage?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdParsedGuestListKeySpecifier = (
  | "matchedGuests"
  | "unmatchedGuestIds"
  | PdParsedGuestListKeySpecifier
)[];
export type PdParsedGuestListFieldPolicy = {
  matchedGuests?: FieldPolicy<any> | FieldReadFunction<any>;
  unmatchedGuestIds?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdPhoneKeySpecifier = ("number" | PdPhoneKeySpecifier)[];
export type PdPhoneFieldPolicy = {
  number?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdRuleKeySpecifier = (
  | "code"
  | "config"
  | "description"
  | "evaluate"
  | "id"
  | "name"
  | "siteId"
  | PdRuleKeySpecifier
)[];
export type PdRuleFieldPolicy = {
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  config?: FieldPolicy<any> | FieldReadFunction<any>;
  description?: FieldPolicy<any> | FieldReadFunction<any>;
  evaluate?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  siteId?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdRuleConfigKeySpecifier = (
  | "code"
  | "enabled"
  | "id"
  | "siteId"
  | "weight"
  | PdRuleConfigKeySpecifier
)[];
export type PdRuleConfigFieldPolicy = {
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  enabled?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  siteId?: FieldPolicy<any> | FieldReadFunction<any>;
  weight?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdRuleMatchKeySpecifier = (
  | "code"
  | "points"
  | "ruleName"
  | "weighting"
  | PdRuleMatchKeySpecifier
)[];
export type PdRuleMatchFieldPolicy = {
  code?: FieldPolicy<any> | FieldReadFunction<any>;
  points?: FieldPolicy<any> | FieldReadFunction<any>;
  ruleName?: FieldPolicy<any> | FieldReadFunction<any>;
  weighting?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdSchedulerRunTimeKeySpecifier = (
  | "hour"
  | "id"
  | "minute"
  | "timezone"
  | PdSchedulerRunTimeKeySpecifier
)[];
export type PdSchedulerRunTimeFieldPolicy = {
  hour?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  minute?: FieldPolicy<any> | FieldReadFunction<any>;
  timezone?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdTaskKeySpecifier = (
  | "assignee"
  | "createdAt"
  | "id"
  | "player"
  | "rulesMatched"
  | "rulesMatchedCount"
  | "score"
  | "snoozeUntil"
  | "status"
  | PdTaskKeySpecifier
)[];
export type PdTaskFieldPolicy = {
  assignee?: FieldPolicy<any> | FieldReadFunction<any>;
  createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  player?: FieldPolicy<any> | FieldReadFunction<any>;
  rulesMatched?: FieldPolicy<any> | FieldReadFunction<any>;
  rulesMatchedCount?: FieldPolicy<any> | FieldReadFunction<any>;
  score?: FieldPolicy<any> | FieldReadFunction<any>;
  snoozeUntil?: FieldPolicy<any> | FieldReadFunction<any>;
  status?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdTaskConnectionKeySpecifier = (
  | "edges"
  | "nodes"
  | "pageInfo"
  | PdTaskConnectionKeySpecifier
)[];
export type PdTaskConnectionFieldPolicy = {
  edges?: FieldPolicy<any> | FieldReadFunction<any>;
  nodes?: FieldPolicy<any> | FieldReadFunction<any>;
  pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdTaskEdgeKeySpecifier = ("cursor" | "node" | PdTaskEdgeKeySpecifier)[];
export type PdTaskEdgeFieldPolicy = {
  cursor?: FieldPolicy<any> | FieldReadFunction<any>;
  node?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdTierKeySpecifier = (
  | "cssColor"
  | "id"
  | "name"
  | "order"
  | PdTierKeySpecifier
)[];
export type PdTierFieldPolicy = {
  cssColor?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  order?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdTimePeriodKeySpecifier = (
  | "count"
  | "dateRange"
  | "default"
  | "enabled"
  | "id"
  | "level"
  | PdTimePeriodKeySpecifier
)[];
export type PdTimePeriodFieldPolicy = {
  count?: FieldPolicy<any> | FieldReadFunction<any>;
  dateRange?: FieldPolicy<any> | FieldReadFunction<any>;
  default?: FieldPolicy<any> | FieldReadFunction<any>;
  enabled?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  level?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdTimePeriodDateRangeKeySpecifier = (
  | "end"
  | "start"
  | PdTimePeriodDateRangeKeySpecifier
)[];
export type PdTimePeriodDateRangeFieldPolicy = {
  end?: FieldPolicy<any> | FieldReadFunction<any>;
  start?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PdUserGroupKeySpecifier = (
  | "excludeFromReports"
  | "guestInteractionType"
  | "id"
  | "members"
  | "name"
  | "usedByRules"
  | PdUserGroupKeySpecifier
)[];
export type PdUserGroupFieldPolicy = {
  excludeFromReports?: FieldPolicy<any> | FieldReadFunction<any>;
  guestInteractionType?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  members?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  usedByRules?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PlanBriefKeySpecifier = ("name" | PlanBriefKeySpecifier)[];
export type PlanBriefFieldPolicy = {
  name?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PlayerKeySpecifier = (
  | "birthday"
  | "communicationSettings"
  | "email"
  | "firstName"
  | "guestAttribute"
  | "guestAttributes"
  | "id"
  | "lastName"
  | "nativeGuestId"
  | "phone"
  | "siteSummary"
  | PlayerKeySpecifier
)[];
export type PlayerFieldPolicy = {
  birthday?: FieldPolicy<any> | FieldReadFunction<any>;
  communicationSettings?: FieldPolicy<any> | FieldReadFunction<any>;
  email?: FieldPolicy<any> | FieldReadFunction<any>;
  firstName?: FieldPolicy<any> | FieldReadFunction<any>;
  guestAttribute?: FieldPolicy<any> | FieldReadFunction<any>;
  guestAttributes?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  lastName?: FieldPolicy<any> | FieldReadFunction<any>;
  nativeGuestId?: FieldPolicy<any> | FieldReadFunction<any>;
  phone?: FieldPolicy<any> | FieldReadFunction<any>;
  siteSummary?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PlayerSiteMetricsKeySpecifier = (
  | "averageDailyActualWin"
  | "averageDailyTheoWin"
  | "averageDailyWorth"
  | "totalActualWin"
  | "totalTheoWin"
  | "totalWorth"
  | PlayerSiteMetricsKeySpecifier
)[];
export type PlayerSiteMetricsFieldPolicy = {
  averageDailyActualWin?: FieldPolicy<any> | FieldReadFunction<any>;
  averageDailyTheoWin?: FieldPolicy<any> | FieldReadFunction<any>;
  averageDailyWorth?: FieldPolicy<any> | FieldReadFunction<any>;
  totalActualWin?: FieldPolicy<any> | FieldReadFunction<any>;
  totalTheoWin?: FieldPolicy<any> | FieldReadFunction<any>;
  totalWorth?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PlayerSiteSummaryKeySpecifier = (
  | "actions"
  | "host"
  | "lastTripEndDate"
  | "metrics"
  | "recentCommunications"
  | "recentCommunicationsV2"
  | "recentEvent"
  | "taskAssignedToMe"
  | "tier"
  | "tierName"
  | PlayerSiteSummaryKeySpecifier
)[];
export type PlayerSiteSummaryFieldPolicy = {
  actions?: FieldPolicy<any> | FieldReadFunction<any>;
  host?: FieldPolicy<any> | FieldReadFunction<any>;
  lastTripEndDate?: FieldPolicy<any> | FieldReadFunction<any>;
  metrics?: FieldPolicy<any> | FieldReadFunction<any>;
  recentCommunications?: FieldPolicy<any> | FieldReadFunction<any>;
  recentCommunicationsV2?: FieldPolicy<any> | FieldReadFunction<any>;
  recentEvent?: FieldPolicy<any> | FieldReadFunction<any>;
  taskAssignedToMe?: FieldPolicy<any> | FieldReadFunction<any>;
  tier?: FieldPolicy<any> | FieldReadFunction<any>;
  tierName?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QueryKeySpecifier = (
  | "applications"
  | "currentApp"
  | "currentCompany"
  | "currentOrg"
  | "currentUser"
  | "dataFeedStatus"
  | "discovery"
  | "emailExists"
  | "heatMapInventory"
  | "heatMapInventorySearch"
  | "license"
  | "licenseValidate"
  | "noAccessUserFind"
  | "odrDashboard"
  | "odrDashboardFolders"
  | "odrDashboards"
  | "odrDataConnector"
  | "odrDataConnectors"
  | "odrDataSources"
  | "odrFilterOptions"
  | "odrJob"
  | "odrJobs"
  | "org"
  | "orgApps"
  | "orgHeatMaps"
  | "orgLicenses"
  | "orgSearch"
  | "orgs"
  | "pdAction"
  | "pdActions"
  | "pdCurrentHost"
  | "pdGoalMetrics"
  | "pdGoalProgram"
  | "pdGoalPrograms"
  | "pdGreetMetrics"
  | "pdGreetRule"
  | "pdGreetRules"
  | "pdGreetSections"
  | "pdGreetSettings"
  | "pdGuest"
  | "pdGuestSearch"
  | "pdHostMappings"
  | "pdLayout"
  | "pdLayoutV2"
  | "pdMarketingProgramActionReasons"
  | "pdMarketingProgramGuestList"
  | "pdMarketingProgramGuestMetrics"
  | "pdMarketingPrograms"
  | "pdNativeHosts"
  | "pdOrgSettings"
  | "pdParseGuestList"
  | "pdRule"
  | "pdRules"
  | "pdTask"
  | "pdTasks"
  | "pdUserGroup"
  | "pdUserGroups"
  | "site"
  | "sites"
  | "subscriptionPlans"
  | "user"
  | "users"
  | "webPushApplicationServerKey"
  | QueryKeySpecifier
)[];
export type QueryFieldPolicy = {
  applications?: FieldPolicy<any> | FieldReadFunction<any>;
  currentApp?: FieldPolicy<any> | FieldReadFunction<any>;
  currentCompany?: FieldPolicy<any> | FieldReadFunction<any>;
  currentOrg?: FieldPolicy<any> | FieldReadFunction<any>;
  currentUser?: FieldPolicy<any> | FieldReadFunction<any>;
  dataFeedStatus?: FieldPolicy<any> | FieldReadFunction<any>;
  discovery?: FieldPolicy<any> | FieldReadFunction<any>;
  emailExists?: FieldPolicy<any> | FieldReadFunction<any>;
  heatMapInventory?: FieldPolicy<any> | FieldReadFunction<any>;
  heatMapInventorySearch?: FieldPolicy<any> | FieldReadFunction<any>;
  license?: FieldPolicy<any> | FieldReadFunction<any>;
  licenseValidate?: FieldPolicy<any> | FieldReadFunction<any>;
  noAccessUserFind?: FieldPolicy<any> | FieldReadFunction<any>;
  odrDashboard?: FieldPolicy<any> | FieldReadFunction<any>;
  odrDashboardFolders?: FieldPolicy<any> | FieldReadFunction<any>;
  odrDashboards?: FieldPolicy<any> | FieldReadFunction<any>;
  odrDataConnector?: FieldPolicy<any> | FieldReadFunction<any>;
  odrDataConnectors?: FieldPolicy<any> | FieldReadFunction<any>;
  odrDataSources?: FieldPolicy<any> | FieldReadFunction<any>;
  odrFilterOptions?: FieldPolicy<any> | FieldReadFunction<any>;
  odrJob?: FieldPolicy<any> | FieldReadFunction<any>;
  odrJobs?: FieldPolicy<any> | FieldReadFunction<any>;
  org?: FieldPolicy<any> | FieldReadFunction<any>;
  orgApps?: FieldPolicy<any> | FieldReadFunction<any>;
  orgHeatMaps?: FieldPolicy<any> | FieldReadFunction<any>;
  orgLicenses?: FieldPolicy<any> | FieldReadFunction<any>;
  orgSearch?: FieldPolicy<any> | FieldReadFunction<any>;
  orgs?: FieldPolicy<any> | FieldReadFunction<any>;
  pdAction?: FieldPolicy<any> | FieldReadFunction<any>;
  pdActions?: FieldPolicy<any> | FieldReadFunction<any>;
  pdCurrentHost?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGoalMetrics?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGoalProgram?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGoalPrograms?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGreetMetrics?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGreetRule?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGreetRules?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGreetSections?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGreetSettings?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGuest?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGuestSearch?: FieldPolicy<any> | FieldReadFunction<any>;
  pdHostMappings?: FieldPolicy<any> | FieldReadFunction<any>;
  pdLayout?: FieldPolicy<any> | FieldReadFunction<any>;
  pdLayoutV2?: FieldPolicy<any> | FieldReadFunction<any>;
  pdMarketingProgramActionReasons?: FieldPolicy<any> | FieldReadFunction<any>;
  pdMarketingProgramGuestList?: FieldPolicy<any> | FieldReadFunction<any>;
  pdMarketingProgramGuestMetrics?: FieldPolicy<any> | FieldReadFunction<any>;
  pdMarketingPrograms?: FieldPolicy<any> | FieldReadFunction<any>;
  pdNativeHosts?: FieldPolicy<any> | FieldReadFunction<any>;
  pdOrgSettings?: FieldPolicy<any> | FieldReadFunction<any>;
  pdParseGuestList?: FieldPolicy<any> | FieldReadFunction<any>;
  pdRule?: FieldPolicy<any> | FieldReadFunction<any>;
  pdRules?: FieldPolicy<any> | FieldReadFunction<any>;
  pdTask?: FieldPolicy<any> | FieldReadFunction<any>;
  pdTasks?: FieldPolicy<any> | FieldReadFunction<any>;
  pdUserGroup?: FieldPolicy<any> | FieldReadFunction<any>;
  pdUserGroups?: FieldPolicy<any> | FieldReadFunction<any>;
  site?: FieldPolicy<any> | FieldReadFunction<any>;
  sites?: FieldPolicy<any> | FieldReadFunction<any>;
  subscriptionPlans?: FieldPolicy<any> | FieldReadFunction<any>;
  user?: FieldPolicy<any> | FieldReadFunction<any>;
  users?: FieldPolicy<any> | FieldReadFunction<any>;
  webPushApplicationServerKey?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type SisenseDataObjectKeySpecifier = (
  | "status"
  | "version"
  | SisenseDataObjectKeySpecifier
)[];
export type SisenseDataObjectFieldPolicy = {
  status?: FieldPolicy<any> | FieldReadFunction<any>;
  version?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type SiteKeySpecifier = (
  | "currency"
  | "dataFeedMapping"
  | "id"
  | "idV2"
  | "name"
  | "nativeSiteMapping"
  | "odrSlotLatestBuild"
  | "pdAction"
  | "pdActions"
  | "pdGreetSections"
  | "pdHostMappings"
  | "pdNativeHostIds"
  | "pdTask"
  | "pdTasks"
  | "slotDataSource"
  | "slotReportLatestUpload"
  | "tz"
  | SiteKeySpecifier
)[];
export type SiteFieldPolicy = {
  currency?: FieldPolicy<any> | FieldReadFunction<any>;
  dataFeedMapping?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  idV2?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  nativeSiteMapping?: FieldPolicy<any> | FieldReadFunction<any>;
  odrSlotLatestBuild?: FieldPolicy<any> | FieldReadFunction<any>;
  pdAction?: FieldPolicy<any> | FieldReadFunction<any>;
  pdActions?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGreetSections?: FieldPolicy<any> | FieldReadFunction<any>;
  pdHostMappings?: FieldPolicy<any> | FieldReadFunction<any>;
  pdNativeHostIds?: FieldPolicy<any> | FieldReadFunction<any>;
  pdTask?: FieldPolicy<any> | FieldReadFunction<any>;
  pdTasks?: FieldPolicy<any> | FieldReadFunction<any>;
  slotDataSource?: FieldPolicy<any> | FieldReadFunction<any>;
  slotReportLatestUpload?: FieldPolicy<any> | FieldReadFunction<any>;
  tz?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type SlotAddonKeySpecifier = ("quantity" | "upperRange" | SlotAddonKeySpecifier)[];
export type SlotAddonFieldPolicy = {
  quantity?: FieldPolicy<any> | FieldReadFunction<any>;
  upperRange?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type SlotReportUploadKeySpecifier = (
  | "id"
  | "lastGamingDate"
  | "maxDateRange"
  | "minDateRange"
  | SlotReportUploadKeySpecifier
)[];
export type SlotReportUploadFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  lastGamingDate?: FieldPolicy<any> | FieldReadFunction<any>;
  maxDateRange?: FieldPolicy<any> | FieldReadFunction<any>;
  minDateRange?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type SlotSiteDataSourceKeySpecifier = (
  | "id"
  | "type"
  | SlotSiteDataSourceKeySpecifier
)[];
export type SlotSiteDataSourceFieldPolicy = {
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  type?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type StatusKeySpecifier = (
  | "allowedActions"
  | "autoRenew"
  | "canceledAt"
  | "currentPeriodEndsAt"
  | "currentPeriodStartedAt"
  | "expiresAt"
  | "isValid"
  | "pausedAt"
  | "status"
  | "trialEndsAt"
  | "trialStartedAt"
  | StatusKeySpecifier
)[];
export type StatusFieldPolicy = {
  allowedActions?: FieldPolicy<any> | FieldReadFunction<any>;
  autoRenew?: FieldPolicy<any> | FieldReadFunction<any>;
  canceledAt?: FieldPolicy<any> | FieldReadFunction<any>;
  currentPeriodEndsAt?: FieldPolicy<any> | FieldReadFunction<any>;
  currentPeriodStartedAt?: FieldPolicy<any> | FieldReadFunction<any>;
  expiresAt?: FieldPolicy<any> | FieldReadFunction<any>;
  isValid?: FieldPolicy<any> | FieldReadFunction<any>;
  pausedAt?: FieldPolicy<any> | FieldReadFunction<any>;
  status?: FieldPolicy<any> | FieldReadFunction<any>;
  trialEndsAt?: FieldPolicy<any> | FieldReadFunction<any>;
  trialStartedAt?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type SubscriptionPlanKeySpecifier = (
  | "appFullName"
  | "appId"
  | "appName"
  | "billingInterval"
  | "icon"
  | "id"
  | "isOnprem"
  | "name"
  | "package"
  | SubscriptionPlanKeySpecifier
)[];
export type SubscriptionPlanFieldPolicy = {
  appFullName?: FieldPolicy<any> | FieldReadFunction<any>;
  appId?: FieldPolicy<any> | FieldReadFunction<any>;
  appName?: FieldPolicy<any> | FieldReadFunction<any>;
  billingInterval?: FieldPolicy<any> | FieldReadFunction<any>;
  icon?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  isOnprem?: FieldPolicy<any> | FieldReadFunction<any>;
  name?: FieldPolicy<any> | FieldReadFunction<any>;
  package?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type UserKeySpecifier = (
  | "accessLevel"
  | "accessList"
  | "email"
  | "firstName"
  | "id"
  | "isAdmin"
  | "lastName"
  | "mfa"
  | "pdGoalPrograms"
  | "pdHostMappings"
  | "pdUserGroup"
  | "phone"
  | UserKeySpecifier
)[];
export type UserFieldPolicy = {
  accessLevel?: FieldPolicy<any> | FieldReadFunction<any>;
  accessList?: FieldPolicy<any> | FieldReadFunction<any>;
  email?: FieldPolicy<any> | FieldReadFunction<any>;
  firstName?: FieldPolicy<any> | FieldReadFunction<any>;
  id?: FieldPolicy<any> | FieldReadFunction<any>;
  isAdmin?: FieldPolicy<any> | FieldReadFunction<any>;
  lastName?: FieldPolicy<any> | FieldReadFunction<any>;
  mfa?: FieldPolicy<any> | FieldReadFunction<any>;
  pdGoalPrograms?: FieldPolicy<any> | FieldReadFunction<any>;
  pdHostMappings?: FieldPolicy<any> | FieldReadFunction<any>;
  pdUserGroup?: FieldPolicy<any> | FieldReadFunction<any>;
  phone?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type UserAppAccessKeySpecifier = (
  | "app"
  | "role"
  | "site"
  | UserAppAccessKeySpecifier
)[];
export type UserAppAccessFieldPolicy = {
  app?: FieldPolicy<any> | FieldReadFunction<any>;
  role?: FieldPolicy<any> | FieldReadFunction<any>;
  site?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type VersionsKeySpecifier = (
  | "apps"
  | "sisense"
  | "sisenseDataObject"
  | VersionsKeySpecifier
)[];
export type VersionsFieldPolicy = {
  apps?: FieldPolicy<any> | FieldReadFunction<any>;
  sisense?: FieldPolicy<any> | FieldReadFunction<any>;
  sisenseDataObject?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type WebPushPublicKeyKeySpecifier = ("base64" | WebPushPublicKeyKeySpecifier)[];
export type WebPushPublicKeyFieldPolicy = {
  base64?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type StrictTypedTypePolicies = {
  Address?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | AddressKeySpecifier | (() => undefined | AddressKeySpecifier);
    fields?: AddressFieldPolicy;
  };
  AppRole?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | AppRoleKeySpecifier | (() => undefined | AppRoleKeySpecifier);
    fields?: AppRoleFieldPolicy;
  };
  AppSubscription?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | AppSubscriptionKeySpecifier
      | (() => undefined | AppSubscriptionKeySpecifier);
    fields?: AppSubscriptionFieldPolicy;
  };
  Application?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ApplicationKeySpecifier
      | (() => undefined | ApplicationKeySpecifier);
    fields?: ApplicationFieldPolicy;
  };
  ApplicationSubscription?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | ApplicationSubscriptionKeySpecifier
      | (() => undefined | ApplicationSubscriptionKeySpecifier);
    fields?: ApplicationSubscriptionFieldPolicy;
  };
  CommunicationSettings?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | CommunicationSettingsKeySpecifier
      | (() => undefined | CommunicationSettingsKeySpecifier);
    fields?: CommunicationSettingsFieldPolicy;
  };
  Company?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | CompanyKeySpecifier | (() => undefined | CompanyKeySpecifier);
    fields?: CompanyFieldPolicy;
  };
  Config?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | ConfigKeySpecifier | (() => undefined | ConfigKeySpecifier);
    fields?: ConfigFieldPolicy;
  };
  Currency?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | CurrencyKeySpecifier | (() => undefined | CurrencyKeySpecifier);
    fields?: CurrencyFieldPolicy;
  };
  DataAdapter?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DataAdapterKeySpecifier
      | (() => undefined | DataAdapterKeySpecifier);
    fields?: DataAdapterFieldPolicy;
  };
  DataAdapterStageDb?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DataAdapterStageDbKeySpecifier
      | (() => undefined | DataAdapterStageDbKeySpecifier);
    fields?: DataAdapterStageDbFieldPolicy;
  };
  DataFeedStatus?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | DataFeedStatusKeySpecifier
      | (() => undefined | DataFeedStatusKeySpecifier);
    fields?: DataFeedStatusFieldPolicy;
  };
  Discovery?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | DiscoveryKeySpecifier | (() => undefined | DiscoveryKeySpecifier);
    fields?: DiscoveryFieldPolicy;
  };
  Env?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | EnvKeySpecifier | (() => undefined | EnvKeySpecifier);
    fields?: EnvFieldPolicy;
  };
  FeedSiteMapping?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | FeedSiteMappingKeySpecifier
      | (() => undefined | FeedSiteMappingKeySpecifier);
    fields?: FeedSiteMappingFieldPolicy;
  };
  GuestAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | GuestAttributeKeySpecifier
      | (() => undefined | GuestAttributeKeySpecifier);
    fields?: GuestAttributeFieldPolicy;
  };
  HeatMap?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | HeatMapKeySpecifier | (() => undefined | HeatMapKeySpecifier);
    fields?: HeatMapFieldPolicy;
  };
  Keycloak?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | KeycloakKeySpecifier | (() => undefined | KeycloakKeySpecifier);
    fields?: KeycloakFieldPolicy;
  };
  License?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | LicenseKeySpecifier | (() => undefined | LicenseKeySpecifier);
    fields?: LicenseFieldPolicy;
  };
  LicenseError?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | LicenseErrorKeySpecifier
      | (() => undefined | LicenseErrorKeySpecifier);
    fields?: LicenseErrorFieldPolicy;
  };
  LicenseStatus?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | LicenseStatusKeySpecifier
      | (() => undefined | LicenseStatusKeySpecifier);
    fields?: LicenseStatusFieldPolicy;
  };
  LicenseVerification?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | LicenseVerificationKeySpecifier
      | (() => undefined | LicenseVerificationKeySpecifier);
    fields?: LicenseVerificationFieldPolicy;
  };
  Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier);
    fields?: MutationFieldPolicy;
  };
  NativeSiteMapping?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | NativeSiteMappingKeySpecifier
      | (() => undefined | NativeSiteMappingKeySpecifier);
    fields?: NativeSiteMappingFieldPolicy;
  };
  OdrBuildJob?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrBuildJobKeySpecifier
      | (() => undefined | OdrBuildJobKeySpecifier);
    fields?: OdrBuildJobFieldPolicy;
  };
  OdrBuildJobStatus?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrBuildJobStatusKeySpecifier
      | (() => undefined | OdrBuildJobStatusKeySpecifier);
    fields?: OdrBuildJobStatusFieldPolicy;
  };
  OdrDashboard?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrDashboardKeySpecifier
      | (() => undefined | OdrDashboardKeySpecifier);
    fields?: OdrDashboardFieldPolicy;
  };
  OdrDashboardBrief?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrDashboardBriefKeySpecifier
      | (() => undefined | OdrDashboardBriefKeySpecifier);
    fields?: OdrDashboardBriefFieldPolicy;
  };
  OdrDashboardDateRange?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrDashboardDateRangeKeySpecifier
      | (() => undefined | OdrDashboardDateRangeKeySpecifier);
    fields?: OdrDashboardDateRangeFieldPolicy;
  };
  OdrDashboardFolder?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrDashboardFolderKeySpecifier
      | (() => undefined | OdrDashboardFolderKeySpecifier);
    fields?: OdrDashboardFolderFieldPolicy;
  };
  OdrDataConnector?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrDataConnectorKeySpecifier
      | (() => undefined | OdrDataConnectorKeySpecifier);
    fields?: OdrDataConnectorFieldPolicy;
  };
  OdrDataRefreshTime?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrDataRefreshTimeKeySpecifier
      | (() => undefined | OdrDataRefreshTimeKeySpecifier);
    fields?: OdrDataRefreshTimeFieldPolicy;
  };
  OdrDataSource?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrDataSourceKeySpecifier
      | (() => undefined | OdrDataSourceKeySpecifier);
    fields?: OdrDataSourceFieldPolicy;
  };
  OdrExportJob?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrExportJobKeySpecifier
      | (() => undefined | OdrExportJobKeySpecifier);
    fields?: OdrExportJobFieldPolicy;
  };
  OdrExportStatus?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrExportStatusKeySpecifier
      | (() => undefined | OdrExportStatusKeySpecifier);
    fields?: OdrExportStatusFieldPolicy;
  };
  OdrFilterOptions?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrFilterOptionsKeySpecifier
      | (() => undefined | OdrFilterOptionsKeySpecifier);
    fields?: OdrFilterOptionsFieldPolicy;
  };
  OdrHostVizParams?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrHostVizParamsKeySpecifier
      | (() => undefined | OdrHostVizParamsKeySpecifier);
    fields?: OdrHostVizParamsFieldPolicy;
  };
  OdrJaqlValueConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrJaqlValueConnectionKeySpecifier
      | (() => undefined | OdrJaqlValueConnectionKeySpecifier);
    fields?: OdrJaqlValueConnectionFieldPolicy;
  };
  OdrJaqlValueEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrJaqlValueEdgeKeySpecifier
      | (() => undefined | OdrJaqlValueEdgeKeySpecifier);
    fields?: OdrJaqlValueEdgeFieldPolicy;
  };
  OdrJaqlValueType?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrJaqlValueTypeKeySpecifier
      | (() => undefined | OdrJaqlValueTypeKeySpecifier);
    fields?: OdrJaqlValueTypeFieldPolicy;
  };
  OdrMssqlParams?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrMssqlParamsKeySpecifier
      | (() => undefined | OdrMssqlParamsKeySpecifier);
    fields?: OdrMssqlParamsFieldPolicy;
  };
  OdrSimpleFilter?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrSimpleFilterKeySpecifier
      | (() => undefined | OdrSimpleFilterKeySpecifier);
    fields?: OdrSimpleFilterFieldPolicy;
  };
  OdrSiteFilter?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrSiteFilterKeySpecifier
      | (() => undefined | OdrSiteFilterKeySpecifier);
    fields?: OdrSiteFilterFieldPolicy;
  };
  OdrSlotLatestBuildCsvUpload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrSlotLatestBuildCsvUploadKeySpecifier
      | (() => undefined | OdrSlotLatestBuildCsvUploadKeySpecifier);
    fields?: OdrSlotLatestBuildCsvUploadFieldPolicy;
  };
  OdrSlotLatestBuildDataFeed?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrSlotLatestBuildDataFeedKeySpecifier
      | (() => undefined | OdrSlotLatestBuildDataFeedKeySpecifier);
    fields?: OdrSlotLatestBuildDataFeedFieldPolicy;
  };
  OdrWidget?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | OdrWidgetKeySpecifier | (() => undefined | OdrWidgetKeySpecifier);
    fields?: OdrWidgetFieldPolicy;
  };
  OdrWidgetReference?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OdrWidgetReferenceKeySpecifier
      | (() => undefined | OdrWidgetReferenceKeySpecifier);
    fields?: OdrWidgetReferenceFieldPolicy;
  };
  Org?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | OrgKeySpecifier | (() => undefined | OrgKeySpecifier);
    fields?: OrgFieldPolicy;
  };
  OrgApp?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | OrgAppKeySpecifier | (() => undefined | OrgAppKeySpecifier);
    fields?: OrgAppFieldPolicy;
  };
  OrgFeatures?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrgFeaturesKeySpecifier
      | (() => undefined | OrgFeaturesKeySpecifier);
    fields?: OrgFeaturesFieldPolicy;
  };
  OrgHeatMap?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrgHeatMapKeySpecifier
      | (() => undefined | OrgHeatMapKeySpecifier);
    fields?: OrgHeatMapFieldPolicy;
  };
  OrgLicense?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrgLicenseKeySpecifier
      | (() => undefined | OrgLicenseKeySpecifier);
    fields?: OrgLicenseFieldPolicy;
  };
  OrgOnPremTunnel?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | OrgOnPremTunnelKeySpecifier
      | (() => undefined | OrgOnPremTunnelKeySpecifier);
    fields?: OrgOnPremTunnelFieldPolicy;
  };
  PageInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | PageInfoKeySpecifier | (() => undefined | PageInfoKeySpecifier);
    fields?: PageInfoFieldPolicy;
  };
  Payment?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | PaymentKeySpecifier | (() => undefined | PaymentKeySpecifier);
    fields?: PaymentFieldPolicy;
  };
  PdBirthday?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdBirthdayKeySpecifier
      | (() => undefined | PdBirthdayKeySpecifier);
    fields?: PdBirthdayFieldPolicy;
  };
  PdEmail?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | PdEmailKeySpecifier | (() => undefined | PdEmailKeySpecifier);
    fields?: PdEmailFieldPolicy;
  };
  PdEvaluationResult?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdEvaluationResultKeySpecifier
      | (() => undefined | PdEvaluationResultKeySpecifier);
    fields?: PdEvaluationResultFieldPolicy;
  };
  PdGoalProgram?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGoalProgramKeySpecifier
      | (() => undefined | PdGoalProgramKeySpecifier);
    fields?: PdGoalProgramFieldPolicy;
  };
  PdGoalProgramMetric?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGoalProgramMetricKeySpecifier
      | (() => undefined | PdGoalProgramMetricKeySpecifier);
    fields?: PdGoalProgramMetricFieldPolicy;
  };
  PdGoalProgramTargetMatrix?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGoalProgramTargetMatrixKeySpecifier
      | (() => undefined | PdGoalProgramTargetMatrixKeySpecifier);
    fields?: PdGoalProgramTargetMatrixFieldPolicy;
  };
  PdGreet?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | PdGreetKeySpecifier | (() => undefined | PdGreetKeySpecifier);
    fields?: PdGreetFieldPolicy;
  };
  PdGreetMetricDefinition?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGreetMetricDefinitionKeySpecifier
      | (() => undefined | PdGreetMetricDefinitionKeySpecifier);
    fields?: PdGreetMetricDefinitionFieldPolicy;
  };
  PdGreetReportConfig?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGreetReportConfigKeySpecifier
      | (() => undefined | PdGreetReportConfigKeySpecifier);
    fields?: PdGreetReportConfigFieldPolicy;
  };
  PdGreetRule?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGreetRuleKeySpecifier
      | (() => undefined | PdGreetRuleKeySpecifier);
    fields?: PdGreetRuleFieldPolicy;
  };
  PdGreetRuleAssignment?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGreetRuleAssignmentKeySpecifier
      | (() => undefined | PdGreetRuleAssignmentKeySpecifier);
    fields?: PdGreetRuleAssignmentFieldPolicy;
  };
  PdGreetRuleGroupAssignment?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGreetRuleGroupAssignmentKeySpecifier
      | (() => undefined | PdGreetRuleGroupAssignmentKeySpecifier);
    fields?: PdGreetRuleGroupAssignmentFieldPolicy;
  };
  PdGreetRuleMetricTrigger?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGreetRuleMetricTriggerKeySpecifier
      | (() => undefined | PdGreetRuleMetricTriggerKeySpecifier);
    fields?: PdGreetRuleMetricTriggerFieldPolicy;
  };
  PdGreetRuleSpecialTrigger?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGreetRuleSpecialTriggerKeySpecifier
      | (() => undefined | PdGreetRuleSpecialTriggerKeySpecifier);
    fields?: PdGreetRuleSpecialTriggerFieldPolicy;
  };
  PdGreetRuleSpecialTriggerValue?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGreetRuleSpecialTriggerValueKeySpecifier
      | (() => undefined | PdGreetRuleSpecialTriggerValueKeySpecifier);
    fields?: PdGreetRuleSpecialTriggerValueFieldPolicy;
  };
  PdGreetSection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGreetSectionKeySpecifier
      | (() => undefined | PdGreetSectionKeySpecifier);
    fields?: PdGreetSectionFieldPolicy;
  };
  PdGreetSettings?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGreetSettingsKeySpecifier
      | (() => undefined | PdGreetSettingsKeySpecifier);
    fields?: PdGreetSettingsFieldPolicy;
  };
  PdGreetSuppressionDays?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGreetSuppressionDaysKeySpecifier
      | (() => undefined | PdGreetSuppressionDaysKeySpecifier);
    fields?: PdGreetSuppressionDaysFieldPolicy;
  };
  PdGreetTimeout?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGreetTimeoutKeySpecifier
      | (() => undefined | PdGreetTimeoutKeySpecifier);
    fields?: PdGreetTimeoutFieldPolicy;
  };
  PdGreeterStatus?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGreeterStatusKeySpecifier
      | (() => undefined | PdGreeterStatusKeySpecifier);
    fields?: PdGreeterStatusFieldPolicy;
  };
  PdGuestAction?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGuestActionKeySpecifier
      | (() => undefined | PdGuestActionKeySpecifier);
    fields?: PdGuestActionFieldPolicy;
  };
  PdGuestAttributeConfig?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGuestAttributeConfigKeySpecifier
      | (() => undefined | PdGuestAttributeConfigKeySpecifier);
    fields?: PdGuestAttributeConfigFieldPolicy;
  };
  PdGuestCommunication?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGuestCommunicationKeySpecifier
      | (() => undefined | PdGuestCommunicationKeySpecifier);
    fields?: PdGuestCommunicationFieldPolicy;
  };
  PdGuestCommunicationConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGuestCommunicationConnectionKeySpecifier
      | (() => undefined | PdGuestCommunicationConnectionKeySpecifier);
    fields?: PdGuestCommunicationConnectionFieldPolicy;
  };
  PdGuestCommunicationEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGuestCommunicationEdgeKeySpecifier
      | (() => undefined | PdGuestCommunicationEdgeKeySpecifier);
    fields?: PdGuestCommunicationEdgeFieldPolicy;
  };
  PdGuestEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGuestEventKeySpecifier
      | (() => undefined | PdGuestEventKeySpecifier);
    fields?: PdGuestEventFieldPolicy;
  };
  PdGuestLastContact?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGuestLastContactKeySpecifier
      | (() => undefined | PdGuestLastContactKeySpecifier);
    fields?: PdGuestLastContactFieldPolicy;
  };
  PdGuestMetricTable?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdGuestMetricTableKeySpecifier
      | (() => undefined | PdGuestMetricTableKeySpecifier);
    fields?: PdGuestMetricTableFieldPolicy;
  };
  PdHost?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | PdHostKeySpecifier | (() => undefined | PdHostKeySpecifier);
    fields?: PdHostFieldPolicy;
  };
  PdHostMapping?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdHostMappingKeySpecifier
      | (() => undefined | PdHostMappingKeySpecifier);
    fields?: PdHostMappingFieldPolicy;
  };
  PdLastTrip?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdLastTripKeySpecifier
      | (() => undefined | PdLastTripKeySpecifier);
    fields?: PdLastTripFieldPolicy;
  };
  PdLayout?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | PdLayoutKeySpecifier | (() => undefined | PdLayoutKeySpecifier);
    fields?: PdLayoutFieldPolicy;
  };
  PdLayoutCustomComponent?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdLayoutCustomComponentKeySpecifier
      | (() => undefined | PdLayoutCustomComponentKeySpecifier);
    fields?: PdLayoutCustomComponentFieldPolicy;
  };
  PdLayoutGridStack?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdLayoutGridStackKeySpecifier
      | (() => undefined | PdLayoutGridStackKeySpecifier);
    fields?: PdLayoutGridStackFieldPolicy;
  };
  PdLayoutGridStackComponent?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdLayoutGridStackComponentKeySpecifier
      | (() => undefined | PdLayoutGridStackComponentKeySpecifier);
    fields?: PdLayoutGridStackComponentFieldPolicy;
  };
  PdLayoutGridStackConfig?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdLayoutGridStackConfigKeySpecifier
      | (() => undefined | PdLayoutGridStackConfigKeySpecifier);
    fields?: PdLayoutGridStackConfigFieldPolicy;
  };
  PdLayoutGridStackDimension?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdLayoutGridStackDimensionKeySpecifier
      | (() => undefined | PdLayoutGridStackDimensionKeySpecifier);
    fields?: PdLayoutGridStackDimensionFieldPolicy;
  };
  PdLayoutSisenseComponent?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdLayoutSisenseComponentKeySpecifier
      | (() => undefined | PdLayoutSisenseComponentKeySpecifier);
    fields?: PdLayoutSisenseComponentFieldPolicy;
  };
  PdLayoutSisenseDashboardReference?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdLayoutSisenseDashboardReferenceKeySpecifier
      | (() => undefined | PdLayoutSisenseDashboardReferenceKeySpecifier);
    fields?: PdLayoutSisenseDashboardReferenceFieldPolicy;
  };
  PdLayoutV2?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdLayoutV2KeySpecifier
      | (() => undefined | PdLayoutV2KeySpecifier);
    fields?: PdLayoutV2FieldPolicy;
  };
  PdLayoutV2Component?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdLayoutV2ComponentKeySpecifier
      | (() => undefined | PdLayoutV2ComponentKeySpecifier);
    fields?: PdLayoutV2ComponentFieldPolicy;
  };
  PdLayoutV2ComponentList?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdLayoutV2ComponentListKeySpecifier
      | (() => undefined | PdLayoutV2ComponentListKeySpecifier);
    fields?: PdLayoutV2ComponentListFieldPolicy;
  };
  PdLayoutV2CustomComponent?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdLayoutV2CustomComponentKeySpecifier
      | (() => undefined | PdLayoutV2CustomComponentKeySpecifier);
    fields?: PdLayoutV2CustomComponentFieldPolicy;
  };
  PdLayoutV2DualComponent?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdLayoutV2DualComponentKeySpecifier
      | (() => undefined | PdLayoutV2DualComponentKeySpecifier);
    fields?: PdLayoutV2DualComponentFieldPolicy;
  };
  PdLayoutV2DualComponentList?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdLayoutV2DualComponentListKeySpecifier
      | (() => undefined | PdLayoutV2DualComponentListKeySpecifier);
    fields?: PdLayoutV2DualComponentListFieldPolicy;
  };
  PdLayoutV2Row?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdLayoutV2RowKeySpecifier
      | (() => undefined | PdLayoutV2RowKeySpecifier);
    fields?: PdLayoutV2RowFieldPolicy;
  };
  PdLayoutV2RowConfig?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdLayoutV2RowConfigKeySpecifier
      | (() => undefined | PdLayoutV2RowConfigKeySpecifier);
    fields?: PdLayoutV2RowConfigFieldPolicy;
  };
  PdLayoutV2RowContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdLayoutV2RowContentKeySpecifier
      | (() => undefined | PdLayoutV2RowContentKeySpecifier);
    fields?: PdLayoutV2RowContentFieldPolicy;
  };
  PdLayoutV2Section?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdLayoutV2SectionKeySpecifier
      | (() => undefined | PdLayoutV2SectionKeySpecifier);
    fields?: PdLayoutV2SectionFieldPolicy;
  };
  PdLayoutV2SisenseWidget?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdLayoutV2SisenseWidgetKeySpecifier
      | (() => undefined | PdLayoutV2SisenseWidgetKeySpecifier);
    fields?: PdLayoutV2SisenseWidgetFieldPolicy;
  };
  PdMarketingProgram?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdMarketingProgramKeySpecifier
      | (() => undefined | PdMarketingProgramKeySpecifier);
    fields?: PdMarketingProgramFieldPolicy;
  };
  PdMarketingProgramActionReason?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdMarketingProgramActionReasonKeySpecifier
      | (() => undefined | PdMarketingProgramActionReasonKeySpecifier);
    fields?: PdMarketingProgramActionReasonFieldPolicy;
  };
  PdMarketingProgramGuestList?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdMarketingProgramGuestListKeySpecifier
      | (() => undefined | PdMarketingProgramGuestListKeySpecifier);
    fields?: PdMarketingProgramGuestListFieldPolicy;
  };
  PdMarketingProgramGuestMetric?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdMarketingProgramGuestMetricKeySpecifier
      | (() => undefined | PdMarketingProgramGuestMetricKeySpecifier);
    fields?: PdMarketingProgramGuestMetricFieldPolicy;
  };
  PdNativeHost?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdNativeHostKeySpecifier
      | (() => undefined | PdNativeHostKeySpecifier);
    fields?: PdNativeHostFieldPolicy;
  };
  PdOrgSettings?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdOrgSettingsKeySpecifier
      | (() => undefined | PdOrgSettingsKeySpecifier);
    fields?: PdOrgSettingsFieldPolicy;
  };
  PdParsedGuestList?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdParsedGuestListKeySpecifier
      | (() => undefined | PdParsedGuestListKeySpecifier);
    fields?: PdParsedGuestListFieldPolicy;
  };
  PdPhone?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | PdPhoneKeySpecifier | (() => undefined | PdPhoneKeySpecifier);
    fields?: PdPhoneFieldPolicy;
  };
  PdRule?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | PdRuleKeySpecifier | (() => undefined | PdRuleKeySpecifier);
    fields?: PdRuleFieldPolicy;
  };
  PdRuleConfig?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdRuleConfigKeySpecifier
      | (() => undefined | PdRuleConfigKeySpecifier);
    fields?: PdRuleConfigFieldPolicy;
  };
  PdRuleMatch?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdRuleMatchKeySpecifier
      | (() => undefined | PdRuleMatchKeySpecifier);
    fields?: PdRuleMatchFieldPolicy;
  };
  PdSchedulerRunTime?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdSchedulerRunTimeKeySpecifier
      | (() => undefined | PdSchedulerRunTimeKeySpecifier);
    fields?: PdSchedulerRunTimeFieldPolicy;
  };
  PdTask?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | PdTaskKeySpecifier | (() => undefined | PdTaskKeySpecifier);
    fields?: PdTaskFieldPolicy;
  };
  PdTaskConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdTaskConnectionKeySpecifier
      | (() => undefined | PdTaskConnectionKeySpecifier);
    fields?: PdTaskConnectionFieldPolicy;
  };
  PdTaskEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdTaskEdgeKeySpecifier
      | (() => undefined | PdTaskEdgeKeySpecifier);
    fields?: PdTaskEdgeFieldPolicy;
  };
  PdTier?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | PdTierKeySpecifier | (() => undefined | PdTierKeySpecifier);
    fields?: PdTierFieldPolicy;
  };
  PdTimePeriod?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdTimePeriodKeySpecifier
      | (() => undefined | PdTimePeriodKeySpecifier);
    fields?: PdTimePeriodFieldPolicy;
  };
  PdTimePeriodDateRange?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdTimePeriodDateRangeKeySpecifier
      | (() => undefined | PdTimePeriodDateRangeKeySpecifier);
    fields?: PdTimePeriodDateRangeFieldPolicy;
  };
  PdUserGroup?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PdUserGroupKeySpecifier
      | (() => undefined | PdUserGroupKeySpecifier);
    fields?: PdUserGroupFieldPolicy;
  };
  PlanBrief?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | PlanBriefKeySpecifier | (() => undefined | PlanBriefKeySpecifier);
    fields?: PlanBriefFieldPolicy;
  };
  Player?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | PlayerKeySpecifier | (() => undefined | PlayerKeySpecifier);
    fields?: PlayerFieldPolicy;
  };
  PlayerSiteMetrics?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PlayerSiteMetricsKeySpecifier
      | (() => undefined | PlayerSiteMetricsKeySpecifier);
    fields?: PlayerSiteMetricsFieldPolicy;
  };
  PlayerSiteSummary?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | PlayerSiteSummaryKeySpecifier
      | (() => undefined | PlayerSiteSummaryKeySpecifier);
    fields?: PlayerSiteSummaryFieldPolicy;
  };
  Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier);
    fields?: QueryFieldPolicy;
  };
  SisenseDataObject?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SisenseDataObjectKeySpecifier
      | (() => undefined | SisenseDataObjectKeySpecifier);
    fields?: SisenseDataObjectFieldPolicy;
  };
  Site?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | SiteKeySpecifier | (() => undefined | SiteKeySpecifier);
    fields?: SiteFieldPolicy;
  };
  SlotAddon?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | SlotAddonKeySpecifier | (() => undefined | SlotAddonKeySpecifier);
    fields?: SlotAddonFieldPolicy;
  };
  SlotReportUpload?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SlotReportUploadKeySpecifier
      | (() => undefined | SlotReportUploadKeySpecifier);
    fields?: SlotReportUploadFieldPolicy;
  };
  SlotSiteDataSource?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SlotSiteDataSourceKeySpecifier
      | (() => undefined | SlotSiteDataSourceKeySpecifier);
    fields?: SlotSiteDataSourceFieldPolicy;
  };
  Status?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | StatusKeySpecifier | (() => undefined | StatusKeySpecifier);
    fields?: StatusFieldPolicy;
  };
  SubscriptionPlan?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | SubscriptionPlanKeySpecifier
      | (() => undefined | SubscriptionPlanKeySpecifier);
    fields?: SubscriptionPlanFieldPolicy;
  };
  User?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier);
    fields?: UserFieldPolicy;
  };
  UserAppAccess?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | UserAppAccessKeySpecifier
      | (() => undefined | UserAppAccessKeySpecifier);
    fields?: UserAppAccessFieldPolicy;
  };
  Versions?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?: false | VersionsKeySpecifier | (() => undefined | VersionsKeySpecifier);
    fields?: VersionsFieldPolicy;
  };
  WebPushPublicKey?: Omit<TypePolicy, "fields" | "keyFields"> & {
    keyFields?:
      | false
      | WebPushPublicKeyKeySpecifier
      | (() => undefined | WebPushPublicKeyKeySpecifier);
    fields?: WebPushPublicKeyFieldPolicy;
  };
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;
