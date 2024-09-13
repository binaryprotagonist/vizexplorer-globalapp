import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignoreDependencies: [
    // Prevents TS errors when building due to Sisense depending on this. Unsure if we could remove in future
    "@types/lodash"
  ],
  ignore: [
    "src/view/graphql/**/*",
    "src/**/__generated__/*",
    "src/view-v2/styles/**/*",
    // TODO remove when new types and utils are used
    "src/view-v2/subscription/index.ts"
  ],
  ignoreExportsUsedInFile: true
};

export default config;
