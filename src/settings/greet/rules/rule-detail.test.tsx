import { act, fireEvent, render, within } from "@testing-library/react";
import { generateDummySites, mockGreetRuleWithMultiselectedOptions } from "testing/mocks";
import { RuleDetail } from "./rule-detail";
import { produce } from "immer";
import {
  PdGreetAssignmentType,
  PdGreetRuleTriggerType,
  PdGuestInteractionType
} from "generated-graphql";
import { ThemeProvider } from "../../../theme";
import { findSpecialTrigger } from "./utils";

const mockRule = mockGreetRuleWithMultiselectedOptions;
const mockSite = generateDummySites(1)[0];
function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<RuleDetail />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    expect(getByTestId("rule-detail")).toBeInTheDocument();
  });

  it("renders expected sections value for a single property org", () => {
    const { getByTestId, queryByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
        siteName={mockRule.site!.name}
      />,
      { wrapper }
    );

    expect(getByTestId("sections")).toHaveTextContent("01, 02");
    expect(queryByTestId("property-sections")).not.toBeInTheDocument();
  });

  it("renders property and sections for a multi-property org", () => {
    const { getByTestId, queryByTestId } = render(
      <RuleDetail
        multiproperty
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
        siteName={mockRule.site!.name}
      />,
      { wrapper }
    );

    expect(getByTestId("property-sections")).toHaveTextContent(
      `${mockSite.name}, 01, 02`
    );
    expect(queryByTestId("sections")).not.toBeInTheDocument();
  });

  it("renders property name as unknown if it's not provided", () => {
    const { getByTestId } = render(
      <RuleDetail
        multiproperty
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    expect(getByTestId("property-sections")).toHaveTextContent("Unknown property");
  });

  it("renders expected value for Guest Type trigger with value All", () => {
    const allGuestsTriggers = produce(mockRule.triggers, (triggers) => {
      const guestType = findSpecialTrigger(triggers, PdGreetRuleTriggerType.GuestType);
      guestType!.specialValue.valuesIn = [PdGuestInteractionType.All];
    });
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={allGuestsTriggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    expect(getByTestId("guest-type")).toHaveTextContent("All guests");
  });

  it("renders expected value for Guest Type trigger with value Coded", () => {
    const codedGuestTriggers = produce(mockRule.triggers, (triggers) => {
      const guestType = findSpecialTrigger(triggers, PdGreetRuleTriggerType.GuestType);
      guestType!.specialValue.valuesIn = [PdGuestInteractionType.Coded];
    });
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={codedGuestTriggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    expect(getByTestId("guest-type")).toHaveTextContent("Coded");
  });

  it("renders expected value for Guest Type trigger with value Uncoded", () => {
    const codedGuestTriggers = produce(mockRule.triggers, (triggers) => {
      const guestType = findSpecialTrigger(triggers, PdGreetRuleTriggerType.GuestType);
      guestType!.specialValue.valuesIn = [PdGuestInteractionType.Uncoded];
    });
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={codedGuestTriggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    expect(getByTestId("guest-type")).toHaveTextContent("Uncoded");
  });

  it("renders expected values for Special Triggers if `includeAll` is false", () => {
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    expect(getByTestId("tiers")).toHaveTextContent("Platinum, Gold");
    expect(getByTestId("days-of-week")).toHaveTextContent(
      "Sunday, Tuesday, Thursday, Saturday"
    );
  });

  it("renders expected values for Special Triggers if `includeAll` is true", () => {
    const includeAllRule = produce(mockRule, (draft) => {
      draft.triggers.forEach((trigger) => {
        if (trigger.__typename === "PdGreetRuleSpecialTrigger") {
          trigger.specialValue.includeAll = true;
        }
      });
    });
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={includeAllRule.triggers}
        assignment={includeAllRule.assignment}
      />,
      { wrapper }
    );

    expect(getByTestId("tiers")).toHaveTextContent("All tiers");
    expect(getByTestId("days-of-week")).toHaveTextContent("All days");
  });

  it("renders expected Metric Trigger", () => {
    const { getAllByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    const metricTriggers = getAllByTestId("metric-trigger");
    expect(metricTriggers).toHaveLength(1);
    expect(metricTriggers[0]).toHaveTextContent("Today Actual Win: Min 100 Max 200");
  });

  it("renders expected value when ignore suppression is true", () => {
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
        siteName={mockRule.site!.name}
      />,
      { wrapper }
    );

    expect(getByTestId("ignore-suppression")).toHaveTextContent("Ignore suppression: on");
  });

  it("renders expected value when ignore suppression is false", () => {
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression={false}
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
        siteName={mockRule.site!.name}
      />,
      { wrapper }
    );

    expect(getByTestId("ignore-suppression")).toHaveTextContent(
      "Ignore suppression: off"
    );
  });

  it("renders expected weight value for Assignment", () => {
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    expect(getByTestId("assignment-weight")).toHaveTextContent("75");
  });

  it("renders expected label for SpecificUserGroup assignment type", () => {
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    expect(getByTestId("assign-to")).toHaveTextContent("Specific User Group");
  });

  it("renders expected label for GuestHost assignment type", () => {
    const guestHostRule = produce(mockRule, (draft) => {
      draft.assignment!.assignTo!.assignmentToType = PdGreetAssignmentType.GuestHost;
    });
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={guestHostRule.triggers}
        assignment={guestHostRule.assignment}
      />,
      { wrapper }
    );

    expect(getByTestId("assign-to")).toHaveTextContent("Guest Host Only");
  });

  it("renders expected label for GuestHostUserGroup assignment type", () => {
    const guestHostRule = produce(mockRule, (draft) => {
      draft.assignment!.assignTo!.assignmentToType =
        PdGreetAssignmentType.GuestHostUserGroup;
    });
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={guestHostRule.triggers}
        assignment={guestHostRule.assignment}
      />,
      { wrapper }
    );

    expect(getByTestId("assign-to")).toHaveTextContent("Guest Coded User Group");
  });

  it("renders expected label for AllUsers assignment type", () => {
    const guestHostRule = produce(mockRule, (draft) => {
      draft.assignment!.assignTo!.assignmentToType = PdGreetAssignmentType.AllUsers;
    });
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={guestHostRule.triggers}
        assignment={guestHostRule.assignment}
      />,
      { wrapper }
    );

    expect(getByTestId("assign-to")).toHaveTextContent("All Hosts");
  });

  it("renders expected value for User Group", () => {
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    const userGroup = mockRule.assignment!.assignTo!.userGroup!.name;
    expect(getByTestId("user-group")).toHaveTextContent(userGroup);
  });

  it("doesn't render User Group if it doesn't exist", () => {
    const noUserGroupRule = produce(mockRule, (draft) => {
      draft.assignment!.assignTo!.userGroup = null;
    });
    const { queryByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={noUserGroupRule.triggers}
        assignment={noUserGroupRule.assignment}
      />,
      { wrapper }
    );

    expect(queryByTestId("user-group")).not.toBeInTheDocument();
  });

  it("renders expected value for overflow1 group with SpecificUserGroup assignment type", () => {
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    const overflow1 = mockRule.assignment!.overflowAssignment!.userGroup!.name;
    expect(getByTestId("user-group-overflow1")).toHaveTextContent(overflow1);
  });

  it("renders expected value for overflow1 group with GuestHostUserGroup assignment type", () => {
    const guestHostRule = produce(mockRule, (draft) => {
      draft.assignment!.overflowAssignment!.assignmentToType =
        PdGreetAssignmentType.GuestHostUserGroup;
    });
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={guestHostRule.triggers}
        assignment={guestHostRule.assignment}
      />,
      { wrapper }
    );

    expect(getByTestId("user-group-overflow1")).toHaveTextContent(
      "Guest Coded User Group"
    );
  });

  it("renders expected value for overflow1 group with AllUsers assignment type", () => {
    const guestHostRule = produce(mockRule, (draft) => {
      draft.assignment!.overflowAssignment!.assignmentToType =
        PdGreetAssignmentType.AllUsers;
    });
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={guestHostRule.triggers}
        assignment={guestHostRule.assignment}
      />,
      { wrapper }
    );

    expect(getByTestId("user-group-overflow1")).toHaveTextContent("All Hosts");
  });

  it("renders expected value for overflow1 group with GuestHost assignment type", () => {
    const guestHostRule = produce(mockRule, (draft) => {
      draft.assignment!.overflowAssignment!.assignmentToType =
        PdGreetAssignmentType.GuestHost;
    });
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={guestHostRule.triggers}
        assignment={guestHostRule.assignment}
      />,
      { wrapper }
    );

    expect(getByTestId("user-group-overflow1")).toHaveTextContent("Guest Host Only");
  });

  it("doesn't render overflow1 group if it doesn't exist", () => {
    const noOverflow1Rule = produce(mockRule, (draft) => {
      draft.assignment!.overflowAssignment = null;
    });
    const { queryByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={noOverflow1Rule.triggers}
        assignment={noOverflow1Rule.assignment}
      />,
      { wrapper }
    );

    expect(queryByTestId("user-group-overflow1")).not.toBeInTheDocument();
  });

  it("renders expected value for overflow2 group with SpecificUserGroup assignment type", () => {
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    const overflow2 = mockRule.assignment!.overflowAssignment2!.userGroup!.name;
    expect(getByTestId("user-group-overflow2")).toHaveTextContent(overflow2);
  });

  it("renders expected value for overflow2 group with GuestHostUserGroup assignment type", () => {
    const guestHostRule = produce(mockRule, (draft) => {
      draft.assignment!.overflowAssignment2!.assignmentToType =
        PdGreetAssignmentType.GuestHostUserGroup;
    });
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={guestHostRule.triggers}
        assignment={guestHostRule.assignment}
      />,
      { wrapper }
    );

    expect(getByTestId("user-group-overflow2")).toHaveTextContent(
      "Guest Coded User Group"
    );
  });

  it("renders expected value for overflow2 group with AllUsers assignment type", () => {
    const guestHostRule = produce(mockRule, (draft) => {
      draft.assignment!.overflowAssignment2!.assignmentToType =
        PdGreetAssignmentType.AllUsers;
    });
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={guestHostRule.triggers}
        assignment={guestHostRule.assignment}
      />,
      { wrapper }
    );

    expect(getByTestId("user-group-overflow2")).toHaveTextContent("All Hosts");
  });

  it("renders expected value for overflow2 group with GuestHost assignment type", () => {
    const guestHostRule = produce(mockRule, (draft) => {
      draft.assignment!.overflowAssignment2!.assignmentToType =
        PdGreetAssignmentType.GuestHost;
    });
    const { getByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={guestHostRule.triggers}
        assignment={guestHostRule.assignment}
      />,
      { wrapper }
    );

    expect(getByTestId("user-group-overflow2")).toHaveTextContent("Guest Host Only");
  });

  it("doesn't render overflow2 group if it doesn't exist", () => {
    const noOverflow2Rule = produce(mockRule, (draft) => {
      draft.assignment!.overflowAssignment2 = null;
    });
    const { queryByTestId } = render(
      <RuleDetail
        ignoreSuppression
        triggers={noOverflow2Rule.triggers}
        assignment={noOverflow2Rule.assignment}
      />,
      { wrapper }
    );

    expect(queryByTestId("user-group-overflow2")).not.toBeInTheDocument();
  });

  it("renders expected tooltip for Sections for a single property org", () => {
    const { getByTestId, getByRole } = render(
      <RuleDetail
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    act(() => {
      const icon = within(getByTestId("sections")).getByLabelText("Sections");
      fireEvent.mouseOver(icon);
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Sections");
  });

  it("renders expected tooltip for Property sections for a multi property org", () => {
    const { getByTestId, getByRole } = render(
      <RuleDetail
        multiproperty
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
        siteName={mockRule.site!.name}
      />,
      { wrapper }
    );

    act(() => {
      const propertySections = getByTestId("property-sections");
      const icon = within(propertySections).getByLabelText("Property and sections");
      fireEvent.mouseOver(icon);
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Property and sections");
  });

  it("renders expected tooltip for Guest Type", () => {
    const { getByTestId, getByRole } = render(
      <RuleDetail
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    act(() => {
      const icon = within(getByTestId("guest-type")).getByLabelText("Guest type");
      fireEvent.mouseOver(icon);
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Guest type");
  });

  it("renders expected tooltip for Tiers", () => {
    const { getByTestId, getByRole } = render(
      <RuleDetail
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    act(() => {
      const icon = within(getByTestId("tiers")).getByLabelText("Tier");
      fireEvent.mouseOver(icon);
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Tier");
  });

  it("renders expected tooltip for Days of Week", () => {
    const { getByTestId, getByRole } = render(
      <RuleDetail
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    act(() => {
      const icon = within(getByTestId("days-of-week")).getByLabelText("Days of the week");
      fireEvent.mouseOver(icon);
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Days of the week");
  });

  it("renders expected tooltip for Metric Triggers", () => {
    const { getAllByTestId, getByRole } = render(
      <RuleDetail
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    act(() => {
      const metricTriggers = getAllByTestId("metric-trigger");
      const icon = within(metricTriggers[0]).getByLabelText("Metric");
      fireEvent.mouseOver(icon);
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Metric");
  });

  it("renders expected tooltip for Assignment Weight", () => {
    const { getByTestId, getByRole } = render(
      <RuleDetail
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    act(() => {
      const icon = within(getByTestId("assignment-weight")).getByLabelText(
        "Assignment weight"
      );
      fireEvent.mouseOver(icon);
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Assignment weight");
  });

  it("render expected tooltip for Assign To", () => {
    const { getByTestId, getByRole } = render(
      <RuleDetail
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    act(() => {
      const icon = within(getByTestId("assign-to")).getByLabelText("Assign to");
      fireEvent.mouseOver(icon);
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Assign to");
  });

  it("renders expected tooltip for User Group", () => {
    const { getByTestId, getByRole } = render(
      <RuleDetail
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    act(() => {
      const icon = within(getByTestId("user-group")).getByLabelText("User group");
      fireEvent.mouseOver(icon);
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("User group");
  });

  it("renders expected tooltip for Overflow1 Group", () => {
    const { getByTestId, getByRole } = render(
      <RuleDetail
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    act(() => {
      const icon = within(getByTestId("user-group-overflow1")).getByLabelText(
        "Overflow user group"
      );
      fireEvent.mouseOver(icon);
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Overflow user group");
  });

  it("renders expected tooltip for Overflow2 Group", () => {
    const { getByTestId, getByRole } = render(
      <RuleDetail
        ignoreSuppression
        triggers={mockRule.triggers}
        assignment={mockRule.assignment}
      />,
      { wrapper }
    );

    act(() => {
      const icon = within(getByTestId("user-group-overflow2")).getByLabelText(
        "Overflow user group"
      );
      fireEvent.mouseOver(icon);
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Overflow user group");
  });
});
