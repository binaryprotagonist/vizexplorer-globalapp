import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Field, FieldTitle } from "../../view/card";
import { Switch } from "@mui/material";
import { useFnDebounce } from "../../view/utils";
import { GaUserFragment, useUserProfileUpdateMutation } from "generated-graphql";
import { HelpTip } from "../common";

const StyledField = styled(Field)(({ theme }) => ({
  gridTemplateColumns: "180px auto",
  [`@media (max-width: ${theme.breakpoints.values.sm - 1}px)`]: {
    gridTemplateColumns: "170px auto",
    columnGap: theme.spacing(1)
  }
}));

type Props = {
  currentUser: GaUserFragment;
  enabled: boolean;
};

export function MultifactorToggle({ currentUser, enabled }: Props) {
  const debounce = useFnDebounce();
  const [checked, setChecked] = useState<boolean>(enabled);
  const [updateUser, { error: updateErr }] = useUserProfileUpdateMutation();

  useEffect(() => {
    debounce(() => {
      if (checked === enabled) return;
      updateUser({
        variables: { user: { userId: currentUser.id, mfa: checked } }
      });
    }, 500);
  }, [checked]);

  if (updateErr) throw updateErr;

  return (
    <StyledField>
      <FieldTitle variant={"subtitle2"}>
        Enable Multi-Factor
        <HelpTip
          title={
            "If enabled, you will need to enter a verification code sent to the provided email address above upon login"
          }
          placement={"top"}
        />
      </FieldTitle>
      <Switch
        data-testid={"multifactor-switch"}
        checked={checked}
        onChange={() => setChecked((cur) => !cur)}
      />
    </StyledField>
  );
}
