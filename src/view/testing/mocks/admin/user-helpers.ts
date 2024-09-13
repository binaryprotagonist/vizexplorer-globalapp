import { ImpersonateUserDocument } from "generated-graphql";

export function mockImpersonateUser(userId: string) {
  return {
    request: {
      query: ImpersonateUserDocument,
      variables: { userId, redirectUrl: "http://localhost/settings" }
    },
    result: {
      data: { sudoImpersonateUser: "http://localhost/auth/impersonate" }
    }
  };
}
