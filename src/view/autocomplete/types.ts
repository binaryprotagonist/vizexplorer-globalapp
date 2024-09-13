import { ManagedOptionsAutocompleteProps } from "./manage";

export type ManagedOptionsAutocompleteType<T> = {
  type: "managed-options";
} & ManagedOptionsAutocompleteProps<T>;
