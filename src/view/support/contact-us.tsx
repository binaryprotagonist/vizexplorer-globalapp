import { HTMLProps } from "react";
import styled from "@emotion/styled";

export const ContactUsLink = styled((props: HTMLProps<HTMLAnchorElement>) => (
  <a
    {...props}
    href={"https://vizexplorersupport.zendesk.com/hc/en-us/requests/new"}
    target={"_blank"}
    rel={"noreferrer"}
  >
    Contact Us
  </a>
))({
  textDecoration: "none"
});
