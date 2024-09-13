import { BoundaryError } from "./types";

export function isForbiddenError(err: BoundaryError) {
  if ("graphQLErrors" in err) {
    return err.graphQLErrors?.some((err: any) => {
      return err.extensions.code === "FORBIDDEN" || err.message === "permission denied";
    });
  }

  return false;
}

export function forbiddenTitle() {
  return "Forbidden";
}

export function forbiddenMessage() {
  return "Your account doesn't have the required privileges to view this content";
}
