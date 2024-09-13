import { useState } from "react";
import {
  Button,
  Callout,
  Chip,
  Dialog,
  DialogHeader,
  InputLabel,
  TextField,
  Tooltip
} from "@vizexplorer/global-ui-v2";
import {
  Autocomplete,
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
  Box,
  dialogClasses,
  styled
} from "@mui/material";
import { EMAIL_PATTERN_REGEX } from "../../../../../view/utils";

const StyledDialog = styled(Dialog)({
  [`& .${dialogClasses.paper}`]: {
    maxWidth: "420px",
    width: "100%",
    maxHeight: "550px",
    height: "100%"
  }
});

type Props = {
  emails: string[];
  disabled?: boolean;
  onSave: (emails: string[]) => void;
  onClose: VoidFunction;
};

export function ReportBannedGuestDialog({
  emails: initialEmails,
  disabled,
  onSave,
  onClose
}: Props) {
  const [emails, setEmails] = useState<string[]>(initialEmails);
  const [inputValue, setInputValue] = useState<string>("");

  const emailTaken = emails.some((value) => value === inputValue);
  const containsInvalidEmail = !emails.every(isEmailLike);

  function handleSave(input: string, emails: string[]) {
    if (!input.trim().length) {
      onSave(emails);
      return;
    }

    // convert the current input value to an email chip and validate prior to saving
    const combinedEmails = [...emails, input];
    setEmails(combinedEmails);
    setInputValue("");
    if (combinedEmails.every(isEmailLike)) {
      onSave(combinedEmails);
    }
  }

  return (
    <StyledDialog open data-testid={"report-banned-guest-dialog"}>
      <DialogHeader
        title={"Banned guest alert"}
        description={"Enter the email address(es) to report banned guests."}
        onClickClose={onClose}
        disableClose={disabled}
      />

      <Box
        display={"flex"}
        flexDirection={"column"}
        overflow={"auto"}
        mb={"16px"}
        p={"0 16px"}
      >
        <Box display={"flex"} flexDirection={"column"} mb={"24px"}>
          <InputLabel>Email</InputLabel>
          <EmailInput
            value={emails}
            inputValue={inputValue}
            disabled={disabled}
            onChange={(value, reason) => {
              if (reason === "removeOption") {
                setEmails(value);
              }
            }}
            onInputChange={(newValue, reason) => {
              if (reason === "reset" && inputValue.length && !emailTaken) {
                setEmails((cur) => [...cur, inputValue]);
                setInputValue("");
                return;
              }

              const trimmedValue = newValue.trim();
              if (trimmedValue.length && newValue.endsWith(" ") && !emailTaken) {
                setEmails((cur) => [...cur, trimmedValue]);
                setInputValue("");
                return;
              }

              setInputValue(trimmedValue);
            }}
            errorText={
              emailTaken
                ? "Email duplicates not allowed. Please enter unique email addresses."
                : containsInvalidEmail
                  ? "One or more values are not valid email format."
                  : ""
            }
          />
        </Box>

        <Callout
          severity={"info"}
          title={"To add multiple emails, separate them by pressing enter"}
        />
      </Box>

      <Box display={"flex"} m={"auto 16px 24px 16px"}>
        <Button
          fullWidth
          variant={"contained"}
          size={"large"}
          disabled={
            containsInvalidEmail ||
            (!emails.length && !inputValue.trim().length) ||
            emailTaken ||
            disabled
          }
          onClick={() => handleSave(inputValue, emails)}
        >
          Save
        </Button>
      </Box>
    </StyledDialog>
  );
}

function isEmailLike(value: string) {
  return EMAIL_PATTERN_REGEX.test(value);
}

type EmailInputProps = {
  value: string[];
  inputValue: string;
  onChange: (value: string[], reason: AutocompleteChangeReason) => void;
  onInputChange: (value: string, reason: AutocompleteInputChangeReason) => void;
  disabled?: boolean;
  errorText?: string;
};

function EmailInput({
  value,
  inputValue,
  onChange,
  onInputChange,
  disabled,
  errorText
}: EmailInputProps) {
  return (
    <Autocomplete
      freeSolo
      multiple
      disableClearable
      data-testid={"email-input"}
      open={false}
      value={value}
      inputValue={inputValue}
      options={[]}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Enter email..."
          onKeyDown={(event) => {
            if (event.key === "Backspace") {
              event.stopPropagation();
            }
          }}
          error={!!errorText}
          helperText={errorText ?? ""}
        />
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Tooltip
            key={`banned-email-${option}`}
            title={!isEmailLike(option) ? "Invalid email address format" : ""}
            placement={"right"}
          >
            <span style={{ overflow: "hidden" }}>
              <Chip
                data-testid={"email-chip"}
                label={option}
                color={!isEmailLike(option) ? "error" : "primary"}
                {...getTagProps({ index })}
              />
            </span>
          </Tooltip>
        ))
      }
      onChange={(_e, value, reason) => onChange(value, reason)}
      onInputChange={(_e, newValue, reason) => onInputChange(newValue, reason)}
    />
  );
}
