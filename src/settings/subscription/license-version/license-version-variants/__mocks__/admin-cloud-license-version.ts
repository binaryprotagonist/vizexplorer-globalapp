import {
  AdminCloudVersionsDocument,
  AdminCloudVersionsQuery
} from "../__generated__/admin-cloud-license-version";

export function mockAdminCloudVersionsQuery() {
  const data: AdminCloudVersionsQuery = {
    discovery: {
      env: {
        versions: {
          apps: "1.0.0",
          sisenseDataObject: {
            version: "v2.0.0"
          }
        }
      }
    }
  };

  return {
    request: {
      query: AdminCloudVersionsDocument
    },
    result: {
      data
    }
  };
}
