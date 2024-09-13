export function isAdminBuild() {
  return !!import.meta.env.VITE_ENABLE_ADMIN;
}

export function baseUrl() {
  return import.meta.env.BASE_URL;
}

export function applicationId() {
  return isAdminBuild() ? "admin" : "global";
}
