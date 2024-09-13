import { fireEvent, render, within } from "@testing-library/react";
import { AssignmentSettings, UserGroupOption } from "./assignment-settings";
import { ReducerState } from "../reducer/types";
import { produce } from "immer";
import { getInput } from "testing/utils";
import { PdGreetAssignmentType, PdGuestInteractionType } from "generated-graphql";
import { emptyGreetRuleDraft } from "./utils";

const mockState: ReducerState = {
  rule: emptyGreetRuleDraft("0"),
  error: null,
  ruleChanged: true
};

const codedUserGroups = Array.from<any, UserGroupOption>({ length: 3 }, (_, idx) => ({
  label: `Coded User Group ${idx}`,
  value: `${idx}`,
  guestInteraction: PdGuestInteractionType.Coded
}));
const uncodedUserGroups = Array.from<any, UserGroupOption>({ length: 3 }, (_, idx) => ({
  label: `Uncoded User Group ${idx + 3}`,
  value: `${idx + 3}`,
  guestInteraction: PdGuestInteractionType.Uncoded
}));
const allUserGroups = Array.from<any, UserGroupOption>({ length: 3 }, (_, idx) => ({
  label: `All User Group ${idx + 6}`,
  value: `${idx + 6}`,
  guestInteraction: PdGuestInteractionType.All
}));
const nullInteractionUserGroups = Array.from<any, UserGroupOption>(
  { length: 3 },
  (_, idx) => ({
    label: `No Assignment User Group ${idx + 9}`,
    value: `${idx + 9}`,
    guestInteraction: null
  })
);
const combinedUserGroups = [...uncodedUserGroups, ...codedUserGroups, ...allUserGroups];

describe("<AssignmentSettings />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <AssignmentSettings
        state={mockState}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={[]}
      />
    );

    expect(getByTestId("assignment-settings")).toBeInTheDocument();
  });

  it("renders weight slider", () => {
    const { getByTestId } = render(
      <AssignmentSettings
        state={mockState}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={[]}
      />
    );

    expect(getByTestId("weight-slider")).toBeInTheDocument();
  });

  it("sets weight slider value based on provided state", () => {
    const adjustedWeightState = produce(mockState, (draft) => {
      draft.rule.assignment.weight = 45;
    });
    const { getByTestId } = render(
      <AssignmentSettings
        state={adjustedWeightState}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={[]}
      />
    );

    const sliderInput = getInput(getByTestId("weight-slider"));
    expect(sliderInput).toHaveValue("45");
  });

  it("calls dispatch with expected payload when weight slider changes", () => {
    const dispatch = jest.fn();
    const { getByTestId } = render(
      <AssignmentSettings
        state={mockState}
        dispatch={dispatch}
        isMultiProperty={true}
        userGroups={[]}
      />
    );

    const sliderInput = getInput(getByTestId("weight-slider"))!;
    fireEvent.change(sliderInput, { target: { value: 45 } });

    expect(dispatch).toHaveBeenCalledWith({
      type: "UPDATE_WEIGHT",
      payload: { weight: 45 }
    });
  });

  it("renders weight input", () => {
    const { getByTestId } = render(
      <AssignmentSettings
        state={mockState}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={[]}
      />
    );

    expect(getByTestId("weight-input")).toBeInTheDocument();
  });

  it("sets weight input value based on provided state", () => {
    const adjustedWeightState = produce(mockState, (draft) => {
      draft.rule.assignment.weight = 45;
    });
    const { getByTestId } = render(
      <AssignmentSettings
        state={adjustedWeightState}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={[]}
      />
    );

    const weightInput = getInput(getByTestId("weight-input"));
    expect(weightInput).toHaveValue("45");
  });

  it("calls dispatch with expected payload when weight input changes", () => {
    const dispatch = jest.fn();
    const { getByTestId } = render(
      <AssignmentSettings
        state={mockState}
        dispatch={dispatch}
        isMultiProperty={true}
        userGroups={[]}
      />
    );

    const weightInput = getInput(getByTestId("weight-input"))!;
    fireEvent.change(weightInput, { target: { value: 45 } });

    expect(dispatch).toHaveBeenCalledWith({
      type: "UPDATE_WEIGHT",
      payload: { weight: 45 }
    });
  });

  it("renders AssignTo select", () => {
    const { getByTestId } = render(
      <AssignmentSettings
        state={mockState}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={[]}
      />
    );

    expect(getByTestId("assign-to-select")).toBeInTheDocument();
  });

  it("renders AssignTo select disabled if Guest Type is null", () => {
    const nullGuestType = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = null;
    });
    const { getByTestId } = render(
      <AssignmentSettings
        state={nullGuestType}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={[]}
      />
    );

    expect(getInput(getByTestId("assign-to-select"))).toBeDisabled();
  });

  it("renders expected AssignTo assignment group options for All guests Guest Type", () => {
    const allGuestsGuestType = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.All;
    });
    const { getByTestId, getAllByRole } = render(
      <AssignmentSettings
        state={allGuestsGuestType}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={[]}
      />
    );

    const select = getByTestId("assign-to-select");
    fireEvent.mouseDown(within(select).getByRole("combobox"));

    const options = getAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent("All Hosts");
    expect(options[1]).toHaveTextContent("Specific User Group");
  });

  it("renders expected AssignTo assignment group options for Uncoded Guest Type", () => {
    const uncodedGuestType = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.Uncoded;
    });
    const { getByTestId, getAllByRole } = render(
      <AssignmentSettings
        state={uncodedGuestType}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={[]}
      />
    );

    const select = getByTestId("assign-to-select");
    fireEvent.mouseDown(within(select).getByRole("combobox"));

    const options = getAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent("All Hosts");
    expect(options[1]).toHaveTextContent("Specific User Group");
  });

  it("renders expected AssignTo assignment group options for Coded Guest Type", () => {
    const codedGuestType = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.Coded;
    });
    const { getByTestId, getAllByRole } = render(
      <AssignmentSettings
        state={codedGuestType}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={[]}
      />
    );

    const select = getByTestId("assign-to-select");
    fireEvent.mouseDown(within(select).getByRole("combobox"));

    const options = getAllByRole("option");
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent("All Hosts");
    expect(options[1]).toHaveTextContent("Guest Host Only");
    expect(options[2]).toHaveTextContent("Guest Coded User Group");
    expect(options[3]).toHaveTextContent("Specific User Group");
  });

  it("renders AssignTo User Group select if `Specific user group` assignment group is selected", () => {
    const specificUserGroup = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.Coded;
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup
      };
    });
    const { getByTestId } = render(
      <AssignmentSettings
        state={specificUserGroup}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={[]}
      />
    );

    expect(getByTestId("assign-to-group-select")).toBeInTheDocument();
  });

  it("doesn't render AssignTo User Group if `All hosts` assignment group is selected", () => {
    const allUsers = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.Coded;
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.AllUsers
      };
    });
    const { queryByTestId } = render(
      <AssignmentSettings
        state={allUsers}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={[]}
      />
    );

    expect(queryByTestId("assign-to-group-select")).not.toBeInTheDocument();
  });

  it("doesn't render AssignTo User Group if `Guest coded user group` assignment group is selected", () => {
    const guestCodedUserGroup = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.Coded;
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.GuestHostUserGroup
      };
    });
    const { queryByTestId } = render(
      <AssignmentSettings
        state={guestCodedUserGroup}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={[]}
      />
    );

    expect(queryByTestId("assign-to-group-select")).not.toBeInTheDocument();
  });

  it("doesn't render AssignTo User Group if `Guest host only` assignment group is selected", () => {
    const guestHostOnly = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.Coded;
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.GuestHost
      };
    });
    const { queryByTestId } = render(
      <AssignmentSettings
        state={guestHostOnly}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={[]}
      />
    );

    expect(queryByTestId("assign-to-group-select")).not.toBeInTheDocument();
  });

  it("lists all user groups with non-null guestInteraction when `all` guest type is selected", () => {
    const allUserGroups = combinedUserGroups.concat(nullInteractionUserGroups);
    const allGuestsGuestType = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.All;
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup
      };
    });

    const { getByTestId, getAllByRole } = render(
      <AssignmentSettings
        state={allGuestsGuestType}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={allUserGroups}
      />
    );

    const select = getByTestId("assign-to-group-select");
    fireEvent.mouseDown(within(select).getByRole("combobox"));

    const options = getAllByRole("option");
    expect(options).toHaveLength(combinedUserGroups.length);
    expect(options[0]).toHaveTextContent(combinedUserGroups[0].label);
  });

  it("filters user groups when `coded` guest type is selected", () => {
    const specificUserGroup = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.Coded;
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup
      };
    });
    const { getByTestId, getAllByRole } = render(
      <AssignmentSettings
        state={specificUserGroup}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={combinedUserGroups}
      />
    );

    const select = getByTestId("assign-to-group-select");
    fireEvent.mouseDown(within(select).getByRole("combobox"));

    const expectedGroups = codedUserGroups.concat(allUserGroups);
    const options = getAllByRole("option");
    expect(options).toHaveLength(expectedGroups.length);
    expect(options[0]).toHaveTextContent(expectedGroups[0].label);
    expect(options.at(-1)).toHaveTextContent(expectedGroups.at(-1)!.label);
  });

  it("filters user groups when `uncoded` guest type is selected", () => {
    const specificUserGroup = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.Uncoded;
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup
      };
    });
    const { getByTestId, getAllByRole } = render(
      <AssignmentSettings
        state={specificUserGroup}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={combinedUserGroups}
      />
    );

    const select = getByTestId("assign-to-group-select");
    fireEvent.mouseDown(within(select).getByRole("combobox"));

    const options = getAllByRole("option");
    const expectedGroups = uncodedUserGroups.concat(allUserGroups);
    expect(options).toHaveLength(expectedGroups.length);
    expect(options[0]).toHaveTextContent(expectedGroups[0].label);
    expect(options.at(-1)).toHaveTextContent(expectedGroups.at(-1)!.label);
  });

  it("renders overflow1 assignment group select as disabled if `Specific user group` AssignTo assignment group is selected", () => {
    const specificUserGroup = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.Coded;
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup
      };
    });
    const { getByTestId } = render(
      <AssignmentSettings
        state={specificUserGroup}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={[]}
      />
    );

    expect(getByTestId("overflow-select")).toBeInTheDocument();
    expect(getInput(getByTestId("overflow-select"))).toBeDisabled();
  });

  it("renders overflow1 assignment group select as enabled if a specific user group is selected", () => {
    const specificUserGroup = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.Coded;
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
        userGroupId: codedUserGroups[0].value
      };
    });
    const { getByTestId } = render(
      <AssignmentSettings
        state={specificUserGroup}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={codedUserGroups}
      />
    );

    expect(getByTestId("overflow-select")).toBeInTheDocument();
    expect(getInput(getByTestId("overflow-select"))).not.toBeDisabled();
  });

  it("renders overflow1 assignment group select if `Guest host only` AssignTo assignment group is selected", () => {
    const guestHostOnly = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.Coded;
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.GuestHost
      };
    });
    const { getByTestId } = render(
      <AssignmentSettings
        state={guestHostOnly}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={[]}
      />
    );

    expect(getByTestId("overflow-select")).toBeInTheDocument();
    expect(getInput(getByTestId("overflow-select"))).not.toBeDisabled();
  });

  it("renders overflow1 assignment group select if `Guest coded user group` AssignTo assignment group is selected", () => {
    const guestCodedUserGroup = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.Coded;
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.GuestHostUserGroup
      };
    });
    const { getByTestId } = render(
      <AssignmentSettings
        state={guestCodedUserGroup}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={[]}
      />
    );

    expect(getByTestId("overflow-select")).toBeInTheDocument();
    expect(getInput(getByTestId("overflow-select"))).not.toBeDisabled();
  });

  it("doesn't render overflow1 assignment group select if `All hosts` AssignTo assignment group is selected", () => {
    const allUsers = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.Coded;
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.AllUsers
      };
    });
    const { queryByTestId } = render(
      <AssignmentSettings
        state={allUsers}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={[]}
      />
    );

    expect(queryByTestId("overflow-select")).not.toBeInTheDocument();
  });

  it("renders expected assignment group options for overflow1 when `All guests` guest type is selected", () => {
    const allGuestsGuestType = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.All;
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
        userGroupId: allUserGroups[0].value
      };
    });
    const { getByTestId, getAllByRole } = render(
      <AssignmentSettings
        state={allGuestsGuestType}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={allUserGroups}
      />
    );

    const select = getByTestId("overflow-select");
    fireEvent.mouseDown(within(select).getByRole("combobox"));

    const options = getAllByRole("option");
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent("All Hosts");
    expect(options[1]).toHaveTextContent("Specific User Group");
    expect(options[2]).toHaveTextContent("None");
  });

  it("renders expected assignment group options for overflow1 when `Coded` guest type is selected", () => {
    const codedGuestType = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.Coded;
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
        userGroupId: codedUserGroups[0].value
      };
    });
    const { getByTestId, getAllByRole } = render(
      <AssignmentSettings
        state={codedGuestType}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={codedUserGroups}
      />
    );

    const select = getByTestId("overflow-select");
    fireEvent.mouseDown(within(select).getByRole("combobox"));

    const options = getAllByRole("option");
    expect(options).toHaveLength(5);
    expect(options[0]).toHaveTextContent("All Hosts");
    expect(options[1]).toHaveTextContent("Guest Host Only");
    expect(options[2]).toHaveTextContent("Guest Coded User Group");
    expect(options[3]).toHaveTextContent("Specific User Group");
    expect(options[4]).toHaveTextContent("None");
  });

  it("it renders all assignment groups for assignTo regardless of being used in overflow1 and overflow2", () => {
    const specificUserGroup = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.Coded;
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup
      };
      draft.rule.assignment.overflowGroup1 = {
        assignmentToType: PdGreetAssignmentType.GuestHostUserGroup
      };
      draft.rule.assignment.overflowGroup2 = {
        assignmentToType: PdGreetAssignmentType.GuestHost
      };
    });
    const { getByTestId, getAllByRole } = render(
      <AssignmentSettings
        state={specificUserGroup}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={codedUserGroups}
      />
    );

    const select = getByTestId("assign-to-select");
    fireEvent.mouseDown(within(select).getByRole("combobox"));

    const options = getAllByRole("option");
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent("All Hosts");
    expect(options[1]).toHaveTextContent("Guest Host Only");
    expect(options[2]).toHaveTextContent("Guest Coded User Group");
    expect(options[3]).toHaveTextContent("Specific User Group");
  });

  it("only renders assignment groups for overflow1 that are not used in AssignTo", () => {
    const specificUserGroup = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.Coded;
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.GuestHostUserGroup
      };
      draft.rule.assignment.overflowGroup1 = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup
      };
      draft.rule.assignment.overflowGroup2 = {
        assignmentToType: PdGreetAssignmentType.GuestHost
      };
    });
    const { getAllByTestId, getAllByRole } = render(
      <AssignmentSettings
        state={specificUserGroup}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={codedUserGroups}
      />
    );

    const overflow1Select = getAllByTestId("overflow-select")[0];
    fireEvent.mouseDown(within(overflow1Select).getByRole("combobox"));

    const options = getAllByRole("option");
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent("All Hosts");
    expect(options[1]).toHaveTextContent("Guest Host Only");
    expect(options[2]).toHaveTextContent("Specific User Group");
    expect(options[3]).toHaveTextContent("None");
  });

  it("only renders assignment groups for overflow2 that are not used in AssignTo and overflow1", () => {
    const specificUserGroup = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.Coded;
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.GuestHostUserGroup
      };
      draft.rule.assignment.overflowGroup1 = {
        assignmentToType: PdGreetAssignmentType.GuestHost
      };
      draft.rule.assignment.overflowGroup2 = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup
      };
    });
    const { getAllByTestId, getAllByRole } = render(
      <AssignmentSettings
        state={specificUserGroup}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={codedUserGroups}
      />
    );

    const overflow2Select = getAllByTestId("overflow-select")[1];
    fireEvent.mouseDown(within(overflow2Select).getByRole("combobox"));

    const options = getAllByRole("option");
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent("All Hosts");
    expect(options[1]).toHaveTextContent("Specific User Group");
    expect(options[2]).toHaveTextContent("None");
  });

  it("it renders all user groups for assignTo regardless of being used in overflow1 and overflow2", () => {
    const specificUserGroup = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.All;
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
        userGroupId: combinedUserGroups[0].value
      };
      draft.rule.assignment.overflowGroup1 = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
        userGroupId: combinedUserGroups[1].value
      };
      draft.rule.assignment.overflowGroup2 = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
        userGroupId: combinedUserGroups[2].value
      };
    });
    const { getByTestId, getAllByRole, getByRole } = render(
      <AssignmentSettings
        state={specificUserGroup}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={combinedUserGroups}
      />
    );

    const select = getByTestId("assign-to-group-select");
    fireEvent.mouseDown(within(select).getByRole("combobox"));

    const listbox = getByRole("listbox");
    const options = getAllByRole("option");
    expect(options).toHaveLength(combinedUserGroups.length);
    expect(listbox).toHaveTextContent(combinedUserGroups[0].label);
    expect(listbox).toHaveTextContent(combinedUserGroups[1].label);
    expect(listbox).toHaveTextContent(combinedUserGroups[2].label);
  });

  it("only renders user groups for overflow1 that are not used in AssignTo", () => {
    const specificUserGroup = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.All;
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
        userGroupId: combinedUserGroups[0].value
      };
      draft.rule.assignment.overflowGroup1 = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
        userGroupId: combinedUserGroups[1].value
      };
      draft.rule.assignment.overflowGroup2 = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
        userGroupId: combinedUserGroups[2].value
      };
    });
    const { getAllByTestId, getAllByRole, getByRole } = render(
      <AssignmentSettings
        state={specificUserGroup}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={combinedUserGroups}
      />
    );

    const overflow1GroupSelect = getAllByTestId("overflow-group-select")[0];
    fireEvent.mouseDown(within(overflow1GroupSelect).getByRole("combobox"));

    const listbox = getByRole("listbox");
    const options = getAllByRole("option");
    expect(options).toHaveLength(combinedUserGroups.length - 1);
    expect(listbox).toHaveTextContent(combinedUserGroups[1].label);
    expect(listbox).toHaveTextContent(combinedUserGroups[2].label);
    expect(listbox).not.toHaveTextContent(combinedUserGroups[0].label);
  });

  it("only renders user groups for overflow2 that are not used in AssignTo and overflow1", () => {
    const specificUserGroup = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.All;
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
        userGroupId: combinedUserGroups[0].value
      };
      draft.rule.assignment.overflowGroup1 = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
        userGroupId: combinedUserGroups[1].value
      };
      draft.rule.assignment.overflowGroup2 = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
        userGroupId: combinedUserGroups[2].value
      };
    });
    const { getAllByTestId, getAllByRole, getByRole } = render(
      <AssignmentSettings
        state={specificUserGroup}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={combinedUserGroups}
      />
    );

    const overflow2GroupSelect = getAllByTestId("overflow-group-select")[1];
    fireEvent.mouseDown(within(overflow2GroupSelect).getByRole("combobox"));

    const listbox = getByRole("listbox");
    const options = getAllByRole("option");
    expect(options).toHaveLength(combinedUserGroups.length - 2);
    expect(listbox).toHaveTextContent(combinedUserGroups[2].label);
    expect(listbox).not.toHaveTextContent(combinedUserGroups[0].label);
    expect(listbox).not.toHaveTextContent(combinedUserGroups[1].label);
  });

  it("disables all inputs if `disableFields` is true", () => {
    const specificUserGroup = produce(mockState, (draft) => {
      draft.rule.specialTriggers.guestType = PdGuestInteractionType.All;
      draft.rule.assignment.assignTo = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
        userGroupId: combinedUserGroups[0].value
      };
      draft.rule.assignment.overflowGroup1 = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
        userGroupId: combinedUserGroups[1].value
      };
      draft.rule.assignment.overflowGroup2 = {
        assignmentToType: PdGreetAssignmentType.SpecificUserGroup,
        userGroupId: combinedUserGroups[2].value
      };
    });
    const { getByTestId, getAllByTestId } = render(
      <AssignmentSettings
        state={specificUserGroup}
        dispatch={() => {}}
        isMultiProperty={true}
        userGroups={combinedUserGroups}
        disableFields={true}
      />
    );

    const weightSlider = getInput(getByTestId("weight-slider"));
    const weightInput = getInput(getByTestId("weight-input"));
    const assignToSelect = getInput(getByTestId("assign-to-select"));
    const assignToGroupSelect = getInput(getByTestId("assign-to-group-select"));
    const overflowSelects = getAllByTestId("overflow-select");
    const overflow1Assignment = getInput(overflowSelects[0]);
    const overflow2Assignment = getInput(overflowSelects[1]);
    const overflowGroupSelects = getAllByTestId("overflow-group-select");
    const overflow1Group = getInput(overflowGroupSelects[0]);
    const overflow2Group = getInput(overflowGroupSelects[1]);

    expect(weightSlider).toBeDisabled();
    expect(weightInput).toBeDisabled();
    expect(assignToSelect).toBeDisabled();
    expect(assignToGroupSelect).toBeDisabled();
    expect(overflow1Assignment).toBeDisabled();
    expect(overflow2Assignment).toBeDisabled();
    expect(overflow1Group).toBeDisabled();
    expect(overflow2Group).toBeDisabled();
  });
});
