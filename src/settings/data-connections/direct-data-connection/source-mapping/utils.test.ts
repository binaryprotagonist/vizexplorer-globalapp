import { produce } from "immer";
import {
  generateDummyDataConnectorHostSites,
  generateDummyDataSources
} from "testing/mocks";
import { availableHostSites } from "./utils";

const connectorsHostSites = produce(
  [generateDummyDataConnectorHostSites("1"), generateDummyDataConnectorHostSites("2")],
  (draft) => {
    draft[0].hostVizSiteIds = ["hv 1", "hv 2", "hv 3"];
    draft[1].hostVizSiteIds = ["hv 10", "hv 11", "hv 12"];
  }
);
const sources = produce(generateDummyDataSources(4), (draft) => {
  draft[0].connectorParams!.siteId = connectorsHostSites[0].hostVizSiteIds![0];

  draft[1].connector = { id: connectorsHostSites[0].id, name: "" };
  draft[1].connectorParams!.siteId = connectorsHostSites[0].hostVizSiteIds![1];

  delete draft[2].connector;
  delete draft[2].connectorParams;
});

describe("Source Mapping Utils", () => {
  describe("availableHostSites", () => {
    it("only returns HV sites which are not used in other sources", () => {
      // ["hv 1", "hv 2", "hv 3"] where [0] and [1] are in use
      const res = availableHostSites(connectorsHostSites[0], sources[2].id!, sources);
      expect(res).toHaveLength(1);
      expect(res).toEqual(["hv 3"]);
    });

    it("doesn't consider a HV site as used for the source being edited", () => {
      // ["hv 1", "hv 2", "hv 3"]
      // [0] = used by source being edited
      // [1] = used by other source
      const res = availableHostSites(connectorsHostSites[0], sources[0].id!, sources);
      expect(res).toHaveLength(2);
      expect(res).toEqual(["hv 1", "hv 3"]);
    });

    it("returns a full HV site list if no sites are used by other sources", () => {
      // ["hv 10", "hv 11", "hv 12"]
      const res = availableHostSites(connectorsHostSites[1], sources[2].id!, sources);
      expect(res).toHaveLength(3);
      expect(res).toEqual(["hv 10", "hv 11", "hv 12"]);
    });
  });
});
