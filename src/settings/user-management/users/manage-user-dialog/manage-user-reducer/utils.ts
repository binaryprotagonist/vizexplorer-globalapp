import { ReducerUser } from "./types";

export function createReducerUser(): ReducerUser {
  return {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    accessLevel: null,
    accessList: []
  };
}
