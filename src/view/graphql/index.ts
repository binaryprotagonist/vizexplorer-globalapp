import { DefaultOptions } from "@apollo/client";
import { isAdminBuild } from "../../utils";
import { adminApolloDefaultOptions } from "./admin";

export { UnsecureClientProvider, useUnsecureClient } from "./unsecure-client-provider";
export { appApolloCacheConfig as cacheConfig } from "./app";

export let defaultOptions: DefaultOptions;
if (isAdminBuild()) {
  defaultOptions = adminApolloDefaultOptions;
}
