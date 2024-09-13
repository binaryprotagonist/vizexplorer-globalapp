import { HostGoalUserOptionFragment } from "../__generated__/user-select";

export function generateDummyUserSelectUsers(): HostGoalUserOptionFragment[] {
  return new Array(15).fill(null).map<HostGoalUserOptionFragment>((_, idx) => ({
    id: `${idx}`,
    firstName: `User ${idx}`,
    lastName: `Last ${idx}`,
    pdUserGroup:
      idx < 5
        ? { id: `${idx}`, name: "Group 1" }
        : idx < 10
          ? { id: `${idx}`, name: "Group 2" }
          : undefined
  }));
}
