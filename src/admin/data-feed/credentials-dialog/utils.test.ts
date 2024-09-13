import { slotFeedEndpoint } from "./utils";

describe("<CredentialsDialog /> Utils", () => {
  describe("slotFeedEndpoint", () => {
    beforeAll(() => {
      delete (window as any).location;
      window.location = {
        origin: "http://127.0.0.1"
      } as any;
    });

    it("uses `window.location.origin` to build the URL", () => {
      expect(slotFeedEndpoint("1")).toContain(window.location.origin);
    });

    it("includes correct databasename based on provided `orgId`", () => {
      expect(slotFeedEndpoint("20101")).toContain("database_name=data_feed_20101");
    });

    it("returns expected full url", () => {
      expect(slotFeedEndpoint("20101")).toEqual(
        "http://127.0.0.1/data_feed/new_data_available?database_name=data_feed_20101"
      );
    });
  });
});
