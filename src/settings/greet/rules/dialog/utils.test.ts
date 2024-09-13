import { mockGreetRuleWithMultiselectedOptions } from "testing/mocks";
import { convertGreetRuleToDraft } from "./utils";
import { produce } from "immer";
import { PdGreetAssignmentType } from "generated-graphql";

describe("Greet Rule Dialog utils", () => {
  describe("convertGreetRuleToDraft", () => {
    const mockGreetRule = mockGreetRuleWithMultiselectedOptions;

    it("converts a rule to the expected draft format", () => {
      expect(convertGreetRuleToDraft(mockGreetRule)).toMatchSnapshot();
    });

    it("converts overflow1 to None if overflow1 is null and assignTo is defined", () => {
      const nullOverflow1 = produce(mockGreetRule, (draft) => {
        draft.assignment!.overflowAssignment = null;
        draft.assignment!.overflowAssignment2 = null;
      });
      const convertedRule = convertGreetRuleToDraft(nullOverflow1);

      expect(convertedRule.assignment.overflowGroup1!.assignmentToType).toEqual("None");
      expect(convertedRule.assignment.overflowGroup2).toBeUndefined();
    });

    it("doesn't convert overflow1 to None if assignTo assignment type is All Users", () => {
      const nullOverflow1 = produce(mockGreetRule, (draft) => {
        draft.assignment!.assignTo!.assignmentToType = PdGreetAssignmentType.AllUsers;
        draft.assignment!.overflowAssignment = null;
        draft.assignment!.overflowAssignment2 = null;
      });
      const convertedRule = convertGreetRuleToDraft(nullOverflow1);

      expect(convertedRule.assignment.overflowGroup1).toBeUndefined();
      expect(convertedRule.assignment.overflowGroup2).toBeUndefined();
    });

    it("converts overflow2 to None if overflow2 is null and overflow1 is defined", () => {
      const nullOverflow2 = produce(mockGreetRule, (draft) => {
        draft.assignment!.overflowAssignment2 = null;
      });
      const convertedRule = convertGreetRuleToDraft(nullOverflow2);

      expect(convertedRule.assignment.overflowGroup2!.assignmentToType).toEqual("None");
    });

    it("converts overflow2 to None if overflow2 assignment type is null and overflow1 is defined", () => {
      const nullOverflow2 = produce(mockGreetRule, (draft) => {
        draft.assignment!.overflowAssignment2!.assignmentToType = null;
      });
      const convertedRule = convertGreetRuleToDraft(nullOverflow2);

      expect(convertedRule.assignment.overflowGroup2!.assignmentToType).toEqual("None");
    });

    it("doesn't convert overflow2 to None if overflow1 is null", () => {
      const nullOverflow2 = produce(mockGreetRule, (draft) => {
        draft.assignment!.overflowAssignment = null;
        draft.assignment!.overflowAssignment2 = null;
      });
      const convertedRule = convertGreetRuleToDraft(nullOverflow2);

      expect(convertedRule.assignment.overflowGroup2).toBeUndefined();
    });

    it("doesn't convert overflow2 to None if overflow1 assignment type is All Users", () => {
      const nullOverflow2 = produce(mockGreetRule, (draft) => {
        draft.assignment!.overflowAssignment!.assignmentToType =
          PdGreetAssignmentType.AllUsers;
        draft.assignment!.overflowAssignment2 = null;
      });
      const convertedRule = convertGreetRuleToDraft(nullOverflow2);

      expect(convertedRule.assignment.overflowGroup2).toBeUndefined();
    });
  });
});
