export function nextOrgRoute(currentPath: string, nextOrgId: string) {
  if (!currentPath.includes("/org/")) {
    throw Error("Invalid Org path");
  }
  return currentPath.replace(/\/org\/[0-9]+/, `/org/${nextOrgId}`);
}
