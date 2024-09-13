import { ReactElement } from "react";
import { isAdminBuild } from "../../utils";
import { AdminContainer } from "./admin";
import { AppContainer } from "./app";
import { ContainerProps } from "./types";

export let Container: (props: ContainerProps) => ReactElement | null;
if (isAdminBuild()) {
  Container = AdminContainer;
} else {
  Container = AppContainer;
}
export { GuestContainer } from "./app";
export { GlobalContainer } from "./shared";
