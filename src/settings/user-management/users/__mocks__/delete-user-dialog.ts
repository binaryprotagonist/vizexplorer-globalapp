import { UserDeleteDocument } from "../__generated__/delete-user-dialog";

export function mockUserDelete(userId: string) {
  return {
    request: {
      query: UserDeleteDocument,
      variables: { id: userId }
    },
    result: {
      data: { userDelete: true }
    }
  };
}
