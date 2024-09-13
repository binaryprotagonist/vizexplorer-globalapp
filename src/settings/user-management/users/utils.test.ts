import { mockUnsortedUsers } from "./__mocks__/sort-users";
import { sortUsers } from "./utils";

describe("User Management Users Utils", () => {
  describe("sortUsers", () => {
    it("sorts users", () => {
      expect(sortUsers(mockUnsortedUsers[1], mockUnsortedUsers)).toMatchSnapshot();
    });
  });
});
