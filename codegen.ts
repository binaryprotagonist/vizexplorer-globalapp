import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://apps.vizexplorer.dev/global/api/graphql",
  documents: ["src/**/*.graphql"],
  generates: {
    "src/": {
      documents: ["src/**/*.{ts,tsx}", "!src/**/(graphql|__generated__)/**/*"],
      preset: "near-operation-file",
      presetConfig: {
        folder: "__generated__",
        extension: ".ts",
        baseTypesPath: "view/graphql/generated/graphql.tsx"
      },
      plugins: ["typescript-operations", "typescript-react-apollo"],
      config: { withHooks: true }
    },
    "src/view/graphql/generated/graphql.tsx": {
      documents: "src/view/graphql/**/*.graphql",
      plugins: ["typescript", "typescript-operations", "typescript-react-apollo"],
      config: {
        preResolveTypes: true,
        scalars: {
          PdGreetRuleConditionValue:
            "string | (string | null)[] | number | (number | null)[]"
        }
      }
    },
    "src/view/graphql/generated/apollo-helpers.ts": {
      plugins: ["typescript-apollo-client-helpers"]
    },
    "src/view/graphql/generated/fragment-matcher.ts": {
      plugins: ["fragment-matcher"]
    }
  }
};

export default config;
