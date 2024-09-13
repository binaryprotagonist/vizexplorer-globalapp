export type LicenseAction =
  | {
      type: "generate-new" | "disable" | "enable";
    }
  | {
      type: "tunnel-connect";
      url: string;
    };

export type LicenseStatus = "active" | "expired";
