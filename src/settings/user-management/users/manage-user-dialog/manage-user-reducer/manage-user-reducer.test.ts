import { renderHook } from "@testing-library/react";
import { ReducerAccess, ReducerAction, ReducerState } from "./types";
import { useImmerReducer } from "use-immer";
import { manageUserReducer } from "./manage-user-reducer";
import { act } from "react-dom/test-utils";
import { OrgAccessLevel } from "generated-graphql";
import { produce } from "immer";
import { createReducerUser } from "./utils";

const mockState: ReducerState = {
  user: createReducerUser(),
  fieldErrors: {}
};

describe("manageUserReducer", () => {
  it("can update first name", () => {
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, mockState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-first-name", payload: { firstName: "John" } });
    });

    const [newState] = result.current;
    expect(curState.user.firstName).toEqual("");
    expect(newState.user.firstName).toEqual("John");
  });

  it("can update last name", () => {
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, mockState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-last-name", payload: { lastName: "Doe" } });
    });

    const [newState] = result.current;
    expect(curState.user.lastName).toEqual("");
    expect(newState.user.lastName).toEqual("Doe");
  });

  it("can update phone", () => {
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, mockState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-phone", payload: { phone: "1234567890" } });
    });

    const [newState] = result.current;
    expect(curState.user.phone).toEqual("");
    expect(newState.user.phone).toEqual("1234567890");
  });

  it("can update email", () => {
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, mockState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "update-email", payload: { email: "test@test.com" } });
    });

    const [newState] = result.current;
    expect(curState.user.email).toEqual("");
    expect(newState.user.email).toEqual("test@test.com");
  });

  it("can update password", () => {
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, mockState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-password",
        payload: { password: "password" }
      });
    });

    const [newState] = result.current;
    expect(curState.user.password).toEqual("");
    expect(newState.user.password).toEqual("password");
  });

  it("sets access list with an empty object initially when updating to app-specific access level", () => {
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, mockState)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-access-level",
        payload: { accessLevel: OrgAccessLevel.AppSpecific }
      });
    });

    const [newState] = result.current;
    expect(curState.user.accessLevel).toEqual(null);
    expect(newState.user.accessLevel).toEqual(OrgAccessLevel.AppSpecific);
    expect(newState.user.accessList).toEqual([{}]);
  });

  it("sets access list as an empty array when updating to non app-specific access level", () => {
    const mockAccess: ReducerAccess[] = [{ app: { id: "pdr" } }, {}];
    const stateWithAccess = produce(mockState, (draft) => {
      draft.user.accessList = mockAccess;
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, stateWithAccess)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-access-level",
        payload: { accessLevel: OrgAccessLevel.OrgAdmin }
      });
    });

    const [newState] = result.current;
    expect(curState.user.accessLevel).toEqual(null);
    expect(newState.user.accessLevel).toEqual(OrgAccessLevel.OrgAdmin);
    expect(newState.user.accessList).toEqual([]);
  });

  it("resets access list when updating access level", () => {
    const mockAccess: ReducerAccess[] = [{ app: { id: "pdr" } }, {}];
    const stateWithAccess = produce(mockState, (draft) => {
      draft.user.accessList = mockAccess;
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, stateWithAccess)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-access-level",
        payload: { accessLevel: OrgAccessLevel.AppSpecific }
      });
    });

    const [newState] = result.current;
    expect(curState.user.accessList).toEqual(mockAccess);
    expect(newState.user.accessList).toEqual([{}]);
  });

  it("can add an empty access row", () => {
    const mockAccess: ReducerAccess[] = [{ app: { id: "pdr" } }];
    const stateWithAccess = produce(mockState, (draft) => {
      draft.user.accessLevel = OrgAccessLevel.AppSpecific;
      draft.user.accessList = mockAccess;
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, stateWithAccess)
    );
    const [curState, dispatch] = result.current;

    act(() => {
      dispatch({ type: "add-empty-access-row" });
    });

    const [newState] = result.current;
    expect(curState.user.accessList).toEqual(mockAccess);
    expect(newState.user.accessList).toEqual([...mockAccess, {}]);
  });

  it("doesn't allow adding an empty access row for non app-specific access level", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, mockState)
    );
    const [_, dispatch] = result.current;

    act(() => {
      dispatch({ type: "add-empty-access-row" });
    });

    const [newState] = result.current;
    expect(newState.user.accessList).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(
      "Cannot add access row for non app-specific access level"
    );
  });

  it("can update an access row app", () => {
    const stateWithAccess = produce(mockState, (draft) => {
      draft.user.accessLevel = OrgAccessLevel.AppSpecific;
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, stateWithAccess)
    );
    const [_, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-access-row-app",
        payload: { rowIdx: 0, appId: "pdr" }
      });
    });

    const [newState] = result.current;
    expect(newState.user.accessList[0].app).toEqual({ id: "pdr" });
  });

  it("resets site and role when updating access row app", () => {
    const mockAccess: ReducerAccess[] = [
      { app: { id: "pdr" }, site: { id: "site-1" }, role: { id: "host" } }
    ];
    const stateWithAccess = produce(mockState, (draft) => {
      draft.user.accessLevel = OrgAccessLevel.AppSpecific;
      draft.user.accessList = mockAccess;
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, stateWithAccess)
    );
    const [_, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-access-row-app",
        payload: { rowIdx: 0, appId: "sre" }
      });
    });

    const [newState] = result.current;
    expect(newState.user.accessList[0].app).toEqual({ id: "sre" });
    expect(newState.user.accessList[0].site).toBeUndefined();
    expect(newState.user.accessList[0].role).toBeUndefined();
  });

  it("doesn't allow updating access row app for non app-specific access level", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, mockState)
    );
    const [_, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-access-row-app",
        payload: { rowIdx: 0, appId: "pdr" }
      });
    });

    const [newState] = result.current;
    expect(newState.user.accessList).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(
      "Cannot update access row for non app-specific access level"
    );
  });

  it("doesn't allow updating access row app for an invalid row index", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const stateWithAccess = produce(mockState, (draft) => {
      draft.user.accessLevel = OrgAccessLevel.AppSpecific;
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, stateWithAccess)
    );
    const [_, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-access-row-app",
        payload: { rowIdx: 1, appId: "site-1" }
      });
    });

    const [newState] = result.current;
    expect(newState.user.accessList).toEqual([]);
    expect(console.error).toHaveBeenCalledWith("Invalid access row index");
  });

  it("can update an access row property", () => {
    const stateWithAccess = produce(mockState, (draft) => {
      draft.user.accessLevel = OrgAccessLevel.AppSpecific;
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, stateWithAccess)
    );
    const [_, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-access-row-site",
        payload: { rowIdx: 0, siteId: "site-1" }
      });
    });

    const [newState] = result.current;
    expect(newState.user.accessList[0].site).toEqual({ id: "site-1" });
  });

  it("doesn't allow updating access row property for non app-specific access level", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, mockState)
    );
    const [_, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-access-row-site",
        payload: { rowIdx: 0, siteId: "site-1" }
      });
    });

    const [newState] = result.current;
    expect(newState.user.accessList).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(
      "Cannot update access row for non app-specific access level"
    );
  });

  it("doesn't allow updating access row property for an invalid row index", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const stateWithAccess = produce(mockState, (draft) => {
      draft.user.accessLevel = OrgAccessLevel.AppSpecific;
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, stateWithAccess)
    );
    const [_, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-access-row-site",
        payload: { rowIdx: 1, siteId: "site-1" }
      });
    });

    const [newState] = result.current;
    expect(newState.user.accessList).toEqual([]);
    expect(console.error).toHaveBeenCalledWith("Invalid access row index");
  });

  it("can update an access row role", () => {
    const stateWithAccess = produce(mockState, (draft) => {
      draft.user.accessLevel = OrgAccessLevel.AppSpecific;
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, stateWithAccess)
    );
    const [_, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-access-row-role",
        payload: { rowIdx: 0, roleId: "host" }
      });
    });

    const [newState] = result.current;
    expect(newState.user.accessList[0].role).toEqual({ id: "host" });
  });

  it("doesn't allow updating access row role for non app-specific access level", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, mockState)
    );
    const [_, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-access-row-role",
        payload: { rowIdx: 0, roleId: "host" }
      });
    });

    const [newState] = result.current;
    expect(newState.user.accessList).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(
      "Cannot update access row for non app-specific access level"
    );
  });

  it("doesn't allow updating access row role for an invalid row index", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const stateWithAccess = produce(mockState, (draft) => {
      draft.user.accessLevel = OrgAccessLevel.AppSpecific;
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, stateWithAccess)
    );
    const [_, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update-access-row-role",
        payload: { rowIdx: 1, roleId: "host" }
      });
    });

    const [newState] = result.current;
    expect(newState.user.accessList).toEqual([]);
    expect(console.error).toHaveBeenCalledWith("Invalid access row index");
  });

  it("can remove an access row", () => {
    const mockAccess: ReducerAccess[] = [
      { app: { id: "pdr" }, site: { id: "site-1" }, role: { id: "host" } },
      { app: { id: "sre" } }
    ];
    const stateWithAccess = produce(mockState, (draft) => {
      draft.user.accessLevel = OrgAccessLevel.AppSpecific;
      draft.user.accessList = mockAccess;
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, stateWithAccess)
    );
    const [_, dispatch] = result.current;

    act(() => {
      dispatch({ type: "remove-access-row", payload: { rowIdx: 0 } });
    });

    const [newState] = result.current;
    expect(newState.user.accessList).toEqual([{ app: { id: "sre" } }]);
  });

  it("resets access list to an array with an empty object when removing the last access row", () => {
    const mockAccess: ReducerAccess[] = [{ app: { id: "pdr" } }];
    const stateWithAccess = produce(mockState, (draft) => {
      draft.user.accessLevel = OrgAccessLevel.AppSpecific;
      draft.user.accessList = mockAccess;
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, stateWithAccess)
    );
    const [_, dispatch] = result.current;

    act(() => {
      dispatch({ type: "remove-access-row", payload: { rowIdx: 0 } });
    });

    const [newState] = result.current;
    expect(newState.user.accessList).toEqual([{}]);
  });

  it("doesn't allow removing an access row for an invalid index", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const mockAccess: ReducerAccess[] = [{ app: { id: "pdr" } }];
    const stateWithAccess = produce(mockState, (draft) => {
      draft.user.accessLevel = OrgAccessLevel.AppSpecific;
      draft.user.accessList = mockAccess;
    });
    const { result } = renderHook(() =>
      useImmerReducer<ReducerState, ReducerAction>(manageUserReducer, stateWithAccess)
    );
    const [_, dispatch] = result.current;

    act(() => {
      dispatch({ type: "remove-access-row", payload: { rowIdx: 1 } });
    });

    const [newState] = result.current;
    expect(newState.user.accessList).toEqual(mockAccess);
    expect(console.error).toHaveBeenCalledWith("Invalid access row index");
  });
});
