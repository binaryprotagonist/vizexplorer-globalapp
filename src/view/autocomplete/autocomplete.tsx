import { ManagedOptionsAutocompleteType } from "./types";
import { ManagedOptionsAutocomplete } from "./manage";

type Props<T> = ManagedOptionsAutocompleteType<T>;

export function Autocomplete<T>({ type, ...props }: Props<T>) {
  if (type === "managed-options") {
    return <ManagedOptionsAutocomplete {...props} />;
  }

  return null;
}
