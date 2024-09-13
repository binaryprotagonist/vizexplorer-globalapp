import { OrgHeatMapFragment, SiteMappingFragment } from "generated-graphql";
import { getAssociatedOrgHeatmaps, filenameFromId } from "./utils";

describe("HeatMapAssociations Utils", () => {
  describe("filenameFromId", () => {
    it("returns the filename from an expected heatmap id", () => {
      expect(filenameFromId("s3://maps/1682905190/file.js")).toEqual("file.js");
    });

    it("returns empty string if an empty string is provided", () => {
      expect(filenameFromId("")).toEqual("");
    });
  });

  describe("getAssociatedOrgHeatmaps", () => {
    const site: SiteMappingFragment = {
      id: 1,
      name: "Site 1",
      dataFeedMapping: {
        id: "dfm-1",
        sourceSiteId: "source-site-1"
      }
    };
    const orgHeatMaps: OrgHeatMapFragment[] = [
      {
        id: "ohm-1",
        effectiveFrom: "2021-01-01",
        floorId: "1",
        sourceSiteId: "source-site-1",
        heatMapId: "hm-1"
      },
      {
        id: "ohm-2",
        effectiveFrom: "2022-01-01",
        floorId: "1",
        sourceSiteId: "source-site-2",
        heatMapId: "hm-2"
      }
    ];

    it("returns heatmaps associated with the site", () => {
      expect(getAssociatedOrgHeatmaps(site, orgHeatMaps)).toEqual([orgHeatMaps[0]]);
    });

    it("returns an empty array if no heatmaps are associated with the site", () => {
      expect(getAssociatedOrgHeatmaps(site, [orgHeatMaps[1]])).toEqual([]);
    });

    it("returns an empty array if no heatmaps are provided", () => {
      expect(getAssociatedOrgHeatmaps(site, [])).toEqual([]);
    });

    it("returns an empty array if the site doesn't have a dataFeedMapping", () => {
      const siteNoMapping: SiteMappingFragment = {
        ...site,
        dataFeedMapping: null
      };
      expect(getAssociatedOrgHeatmaps(siteNoMapping, orgHeatMaps)).toEqual([]);
    });
  });
});
