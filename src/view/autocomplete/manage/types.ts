import React, { HTMLAttributes } from "react";

type Render = {
  render?: (props: HTMLAttributes<HTMLLIElement>, value: string) => React.ReactElement;
};

export type OptionTypeEditable<T> = {
  type: "editable";
  value: T;
} & Render;

export type OptionTypeNew = {
  type: "new";
  value: string;
} & Render;

export type OptionType<T> = OptionTypeEditable<T> | OptionTypeNew;

type OptionActionChange<T> = {
  type: "change";
  value: T;
};

type OptionActionEdit<T> = {
  type: "edit";
  value: T;
};

type OptionActionNew = {
  type: "new";
};

export type OptionChangeType<T> =
  | OptionActionChange<T>
  | OptionActionEdit<T>
  | OptionActionNew;
