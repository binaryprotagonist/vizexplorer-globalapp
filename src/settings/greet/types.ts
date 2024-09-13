export const GREET_VIEWS = ["greet-rules", "system-settings"] as const;
export type GreetView = (typeof GREET_VIEWS)[number];
