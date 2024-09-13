import { AboutHostsSettingId } from "./types";

export function aboutHostsSettingTitle(settingId: AboutHostsSettingId): string {
  switch (settingId) {
    case "enable-section-for-greet":
      return "Enable sections for greets assignment";
    case "allow-suppression-without-completion":
      return "Allow suppression without completion";
    case "max-assignment-per-host":
      return "Max assignments per host";
    case "max-missed-greets":
      return "Max missed greets";
  }
}

export function aboutHostsSettingHelp(settingId: AboutHostsSettingId): JSX.Element {
  switch (settingId) {
    case "enable-section-for-greet":
      return (
        <>
          Use sections when determining greet assignment. When enabled, host will be
          required to choose their sections. If disabled, the section picker will be
          turned off.
        </>
      );

    case "allow-suppression-without-completion":
      return (
        <>
          Allow Hosts to suppress a greet without completing it.
          <br />A Suppress button will appear in the greet cards.
        </>
      );

    case "max-assignment-per-host":
      return <>Number of greets a host can be assigned.</>;

    case "max-missed-greets":
      return (
        <>
          Number of consecutive missed greets that will trigger an automatic status change
          to unavailable.
        </>
      );
  }
}
