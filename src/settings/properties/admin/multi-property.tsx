import { useState } from "react";
import {
  FormControlLabel,
  formControlLabelClasses,
  FormGroup,
  styled,
  Switch
} from "@mui/material";
import { useOrgFeaturesUpdateMutation } from "generated-graphql";

const StyledFormControlLabel = styled(FormControlLabel)({
  [`& .${formControlLabelClasses.label}`]: {
    fontWeight: 500
  }
});

type Props = {
  enabled: boolean;
};

export function MultiPropertySwitch({ enabled }: Props) {
  const [checked, setChecked] = useState<boolean>(enabled);

  const [updateFeatures, { error: updateFeaturesErr, loading: updatingFeatures }] =
    useOrgFeaturesUpdateMutation();

  function handleChange(value: boolean) {
    setChecked(value);
    updateFeatures({
      variables: { input: { orgSettings: { multiProperties: value } } }
    });
  }

  if (updateFeaturesErr) throw updateFeaturesErr;

  return (
    <FormGroup>
      <StyledFormControlLabel
        label={"Multi Property"}
        labelPlacement={"start"}
        checked={checked}
        disabled={updatingFeatures}
        onChange={(_, checked) => handleChange(checked)}
        control={<Switch data-testid={"multi-property-switch"} size={"small"} />}
      />
    </FormGroup>
  );
}
