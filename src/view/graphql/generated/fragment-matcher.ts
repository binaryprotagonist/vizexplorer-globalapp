export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    GuestAttributeValue: [
      "PdBirthday",
      "PdEmail",
      "PdGuestLastContact",
      "PdHost",
      "PdLastTrip",
      "PdPhone",
      "PdTier"
    ],
    OdrDataConnectorParams: ["OdrMssqlParams"],
    OdrDataSourceParams: ["OdrHostVizParams"],
    OdrJob: ["OdrBuildJob", "OdrExportJob"],
    OdrSlotLatestBuild: ["OdrSlotLatestBuildCsvUpload", "OdrSlotLatestBuildDataFeed"],
    PdGreetRuleTrigger: ["PdGreetRuleMetricTrigger", "PdGreetRuleSpecialTrigger"],
    PdGuestAction: ["PdGreet", "PdTask"],
    PdLayoutDefinition: ["PdLayoutGridStack"],
    PdLayoutGridStackComponent: ["PdLayoutCustomComponent", "PdLayoutSisenseComponent"],
    PdLayoutV2Component: ["PdLayoutV2CustomComponent", "PdLayoutV2SisenseWidget"],
    PdLayoutV2RowContent: ["PdLayoutV2ComponentList", "PdLayoutV2DualComponentList"]
  }
};
export default result;
