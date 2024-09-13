import { ApplicationSelectAppFragment } from "../__generated__/application-select";

export function generateDummyApplicationSelectApps(
  length = 3
): ApplicationSelectAppFragment[] {
  return Array.from({ length }, (_, i) => ({
    id: `app-${i}`,
    name: `App ${i}`,
    icon: `http://localhost/app-${i}.svg`
  }));
}
