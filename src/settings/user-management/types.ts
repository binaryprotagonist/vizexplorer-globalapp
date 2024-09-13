export const USER_MANAGEMENT_VIEWS = [
  "users",
  "user-groups",
  "host-code-mapping"
] as const;
export type UserManagementView = (typeof USER_MANAGEMENT_VIEWS)[number];
