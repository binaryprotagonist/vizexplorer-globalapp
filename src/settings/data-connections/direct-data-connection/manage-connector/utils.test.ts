import {
  formInputAsCreateInput,
  formInputAsUpdateInput,
  timezoneAsOption,
  validateForm
} from "./utils";
import { FormInput, TimeZoneOption } from "./types";
import { produce } from "immer";
import { generateDummyDataConnectors } from "../../../../view/testing/mocks";
import { defaultTimezone, NotNullObj } from "../../../../view/utils";
import {
  OdrDataConnectorCreateInput,
  OdrDataConnectorKind,
  OdrDataConnectorUpdateInput
} from "generated-graphql";

describe("ManageConnector Utils", () => {
  describe("validateForm", () => {
    const validForm: FormInput = {
      name: "connector 1",
      hostname: "host",
      database: "127.0.0.1",
      port: "1234",
      tlsEnabled: true,
      username: "test user",
      password: "secret",
      dataRefreshTime: new Date(),
      timezone: timezoneAsOption(defaultTimezone("Pacific/Auckland"))
    };
    const onSuccess = jest.fn();
    const onError = jest.fn();

    beforeEach(() => {
      onSuccess.mockClear();
      onError.mockClear();
    });

    it("runs onSuccess if the form data is valid", () => {
      validateForm(validForm, { onSuccess, onError });
      expect(onSuccess).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });

    it("runs onError if the dataRefreshTime is null", () => {
      const invalidForm = produce(validForm, (draft) => {
        draft.dataRefreshTime = null;
      });
      validateForm(invalidForm, { onSuccess, onError });
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalled();
    });
  });

  describe("formInputAsUpdateInput", () => {
    const formInput: NotNullObj<FormInput> = {
      name: "connector 1",
      hostname: "host",
      database: "127.0.0.1",
      port: "1234",
      tlsEnabled: true,
      username: "test user",
      password: "secret",
      dataRefreshTime: new Date(),
      timezone: timezoneAsOption(defaultTimezone("Pacific/Auckland"))
    };
    const connector = generateDummyDataConnectors(1)[0];

    it("returns expected value for a complete form", () => {
      const res = formInputAsUpdateInput(formInput, connector);
      expect(res).toEqual<OdrDataConnectorUpdateInput>({
        id: connector.id,
        name: formInput.name,
        kind: OdrDataConnectorKind.Mssql,
        hostname: formInput.hostname,
        port: Number(formInput.port),
        tlsEnabled: formInput.tlsEnabled,
        database: formInput.database,
        username: formInput.username,
        password: formInput.password,
        dataRefreshTime: {
          hour: formInput.dataRefreshTime.getHours(),
          minute: formInput.dataRefreshTime.getMinutes(),
          timezone: formInput.timezone.value
        }
      });
    });

    it("returns expected value for form with an empty password", () => {
      const noPass = produce(formInput, (draft) => {
        draft.password = "";
      });
      const res = formInputAsUpdateInput(noPass, connector);
      expect(res).toEqual<OdrDataConnectorUpdateInput>({
        id: connector.id,
        name: formInput.name,
        kind: OdrDataConnectorKind.Mssql,
        hostname: formInput.hostname,
        port: Number(formInput.port),
        tlsEnabled: formInput.tlsEnabled,
        database: formInput.database,
        username: formInput.username,
        dataRefreshTime: {
          hour: formInput.dataRefreshTime.getHours(),
          minute: formInput.dataRefreshTime.getMinutes(),
          timezone: formInput.timezone.value
        }
      });
    });

    it("returns expected value for form with a password of `__REDACTED_PASS__`", () => {
      const redactedPass = produce(formInput, (draft) => {
        draft.password = "__REDACTED_PASS__";
      });
      const res = formInputAsUpdateInput(redactedPass, connector);
      expect(res).toEqual<OdrDataConnectorUpdateInput>({
        id: connector.id,
        name: formInput.name,
        kind: OdrDataConnectorKind.Mssql,
        hostname: formInput.hostname,
        port: Number(formInput.port),
        tlsEnabled: formInput.tlsEnabled,
        database: formInput.database,
        username: formInput.username,
        dataRefreshTime: {
          hour: formInput.dataRefreshTime.getHours(),
          minute: formInput.dataRefreshTime.getMinutes(),
          timezone: formInput.timezone.value
        }
      });
    });
  });

  describe("formInputAsCreateInput", () => {
    const formInput: NotNullObj<FormInput> = {
      name: "connector 1",
      hostname: "host",
      database: "127.0.0.1",
      port: "1234",
      tlsEnabled: true,
      username: "test user",
      password: "secret",
      dataRefreshTime: new Date(),
      timezone: timezoneAsOption(defaultTimezone("Pacific/Auckland"))
    };

    it("returns expected value for a complete form", () => {
      const res = formInputAsCreateInput(formInput);
      expect(res).toEqual<OdrDataConnectorCreateInput>({
        name: formInput.name,
        kind: OdrDataConnectorKind.Mssql,
        hostname: formInput.hostname,
        port: Number(formInput.port),
        tlsEnabled: formInput.tlsEnabled,
        database: formInput.database,
        username: formInput.username,
        password: formInput.password,
        dataRefreshTime: {
          hour: formInput.dataRefreshTime.getHours(),
          minute: formInput.dataRefreshTime.getMinutes(),
          timezone: formInput.timezone.value
        }
      });
    });
  });

  describe("timezoneAsOption", () => {
    it("translates a TimeZone into TimeZoneOption", () => {
      const tz = defaultTimezone("Pacific/Auckland");
      const res = timezoneAsOption(tz);
      expect(res).toEqual<TimeZoneOption>({
        label: tz.name,
        value: tz.tzCode
      });
    });
  });
});
