import {
  OdrDataConnector,
  OdrDataConnectorCreateInput,
  OdrDataConnectorKind,
  OdrDataConnectorUpdateInput
} from "generated-graphql";
import { NotNullObj, ValidationParams } from "../../../../view/utils";
import { FormInput, TimeZone, TimeZoneOption } from "./types";

function isNumber(val: any): val is number {
  return !isNaN(Number(val));
}

export function validateForm(form: FormInput, { onSuccess, onError }: ValidationParams) {
  const { dataRefreshTime } = form;
  const hour = dataRefreshTime?.getHours();
  const minute = dataRefreshTime?.getMinutes();

  if (!isNumber(hour) || !isNumber(minute)) {
    onError(
      "Invalid Data Refresh Time. Please verify you have entered the correct format: hh:mm (a|p)m"
    );
    return;
  }

  const validatedForm = form as NotNullObj<FormInput>;
  onSuccess(validatedForm);
}

export function formInputAsUpdateInput(
  input: NotNullObj<FormInput>,
  connector: OdrDataConnector
): OdrDataConnectorUpdateInput {
  const {
    name,
    database,
    port,
    tlsEnabled,
    hostname,
    username,
    password,
    dataRefreshTime,
    timezone
  } = input;

  const hour = dataRefreshTime.getHours();
  const minute = dataRefreshTime.getMinutes();

  const newInput = {
    id: connector.id,
    kind: OdrDataConnectorKind.Mssql,
    name,
    database,
    port: Number(port),
    tlsEnabled,
    hostname,
    username,
    dataRefreshTime: { hour, minute, timezone: timezone.value }
  };
  if (password && password !== "__REDACTED_PASS__") {
    Object.assign(newInput, { password });
  }

  return newInput;
}

export function formInputAsCreateInput(
  input: NotNullObj<FormInput>
): OdrDataConnectorCreateInput {
  const {
    name,
    database,
    port,
    tlsEnabled,
    hostname,
    username,
    password,
    dataRefreshTime,
    timezone
  } = input;

  const hour = dataRefreshTime.getHours();
  const minute = dataRefreshTime.getMinutes();

  return {
    kind: OdrDataConnectorKind.Mssql,
    name,
    database,
    port: Number(port),
    tlsEnabled,
    hostname,
    username,
    password,
    dataRefreshTime: { hour, minute, timezone: timezone.value }
  };
}

export function timezoneAsOption(tz: TimeZone): TimeZoneOption {
  return {
    label: tz.name,
    value: tz.tzCode
  };
}
