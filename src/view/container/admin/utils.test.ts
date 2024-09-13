import { nextOrgRoute } from "./utils";

describe("OrgRoute Utils", () => {
  describe("nextOrgRoute", () => {
    it("can replace an existing orgId in a route path", () => {
      const path = "/org/123/properties/1";
      const nextOrgId = "321";
      expect(nextOrgRoute(path, nextOrgId)).toEqual("/org/321/properties/1");
    });

    it("can replace a exact route", () => {
      const path = "/org/123";
      const nextOrgId = "321";
      expect(nextOrgRoute(path, nextOrgId)).toEqual("/org/321");
    });

    it("throws an error if the provided path doesn't include /org/", () => {
      expect(() => nextOrgRoute("/settings/properties", "123")).toThrow();
    });
  });
});
