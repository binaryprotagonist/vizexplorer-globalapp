import { GreetSettingsFragment, PdGreetSettingsUpdateInput } from "generated-graphql";
import { AboutHostsSettingId } from "./about-hosts";
import { AboutGreetsSettingId } from "./about-greets";
import { AboutGuestsSettingId } from "./about-guests";

export type OptimisticInput = {
  input: PdGreetSettingsUpdateInput;
  newValue: Partial<GreetSettingsFragment>;
};

type AboutGuestsCategory = {
  name: "about-guests";
  settings: AboutGuestsSettingId[];
};

type AboutGreetsCategory = {
  name: "about-greets";
  settings: AboutGreetsSettingId[];
};

type AboutHostsCategory = {
  name: "about-hosts";
  settings: AboutHostsSettingId[];
};

export type GreetCategory =
  | AboutGuestsCategory
  | AboutGreetsCategory
  | AboutHostsCategory;
