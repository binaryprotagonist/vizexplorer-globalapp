import { ChangeEvent, useState } from "react";
import {
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
  useTheme
} from "@mui/material";
import { GeneralDialog } from "../../../../view/dialog";
import { PdreRuleFragment, usePdreRuleConfigUpdateMutation } from "generated-graphql";
import { NumericInput } from "../../../common";
import { FormError } from "../../../../view/form";

type RuleErr = {
  type: "weight" | "other";
  message: string;
};

const MIN_WEIGHT = 1;
const MAX_WEIGHT = 100;

type Props = {
  rule: PdreRuleFragment;
  onClose: () => void;
};

export function ManagePdreRuleDialog({ rule, onClose }: Props) {
  const theme = useTheme();
  const [enabled, setEnabled] = useState<boolean>(!!rule.config?.enabled);
  const [weight, setWeight] = useState<string>(`${rule.config?.weight || 1}`);
  const [error, setError] = useState<RuleErr | null>();
  const [updateRule, { loading: ruleUpdating }] = usePdreRuleConfigUpdateMutation({
    onError: onError,
    onCompleted
  });

  function onError(error: Error) {
    setError({ type: "other", message: error.message });
  }

  function onCompleted() {
    onClose();
  }

  function onWeightChange(event: ChangeEvent<HTMLInputElement>) {
    setError(null);
    setWeight(event.target.value);
    const weightNum = Number(event.target.value);
    if (event.target.value && (weightNum < MIN_WEIGHT || weightNum > MAX_WEIGHT)) {
      setError({
        type: "weight",
        message: `Rule Weight must be between ${MIN_WEIGHT} and ${MAX_WEIGHT}`
      });
    }
  }

  function onSaveClick() {
    setError(null);
    const newWeight = Number(weight);
    if (!weight || isNaN(newWeight) || newWeight < MIN_WEIGHT || newWeight > MAX_WEIGHT) {
      return;
    }

    updateRule({
      variables: {
        input: {
          ruleCode: rule.code,
          siteId: rule.siteId!.toString(),
          enabled,
          weight: newWeight
        }
      }
    });
  }

  return (
    <GeneralDialog
      data-testid={"pdre-rule-edit-dialog"}
      open={true}
      onClose={onClose}
      title={rule.name}
      actions={[
        {
          content: "Cancel",
          disabled: ruleUpdating,
          color: "secondary",
          onClick: onClose
        },
        {
          content: "Save",
          disabled: ruleUpdating || !weight || isNaN(Number(weight)) || !!error,
          variant: "contained",
          color: "primary",
          onClick: onSaveClick
        }
      ]}
    >
      <Box display={"grid"} minWidth={380} maxWidth={460} rowGap={theme.spacing(1)}>
        {error?.type === "other" && <FormError in={true}>{error.message}</FormError>}
        <Typography gutterBottom color={theme.palette.text.secondary}>
          {rule.description}
        </Typography>
        <FormGroup>
          <FormControlLabel
            label={"Enabled"}
            labelPlacement={"start"}
            checked={enabled}
            onChange={(_e, value) => setEnabled(value)}
            control={<Switch data-testid={"pdre-rule-enabled-switch"} />}
            sx={{ marginLeft: 0, justifyContent: "start" }}
            componentsProps={{ typography: { sx: { fontWeight: 500 } } }}
          />
        </FormGroup>
        <NumericInput
          data-testid={"pdre-rule-weight"}
          fullWidth
          autoFocus
          variant={"outlined"}
          label={"Weighting"}
          value={weight}
          onChange={onWeightChange}
          error={error?.type === "weight"}
          helperText={(error?.type === "weight" && error.message) || null}
          inputProps={{
            maxLength: "3"
          }}
        />
      </Box>
    </GeneralDialog>
  );
}
