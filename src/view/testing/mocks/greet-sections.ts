import { GreetSectionFragment } from "generated-graphql";

export function generateDummyGreetSections(length = 3): GreetSectionFragment[] {
  return Array.from({ length }, (_, i) => ({
    __typename: "PdGreetSection",
    section: `${i}`
  }));
}
