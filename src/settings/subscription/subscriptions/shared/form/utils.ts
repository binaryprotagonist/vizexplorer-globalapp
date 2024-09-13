import { BillingInterval } from "generated-graphql";
import { Environment } from "../../types";
import {
  BillingIntervalOption,
  EnvironmentOption,
  PackageTypeOption,
  SelectOption
} from "./types";
import { capitalize } from "../../../../../view/utils/capitalize";

export function findSelectValue<T>(
  value: T,
  options: SelectOption<any, T>[]
): SelectOption<string, T> | null {
  if (!value) return null;
  return options.find((option) => option.value === value) || null;
}

export function environmentAsOption(environment: Environment): EnvironmentOption {
  return {
    label: Display.environment(environment),
    value: environment
  };
}

export function billingIntervalAsOption(
  interval: BillingInterval
): BillingIntervalOption {
  return {
    label: Display.billingInterval(interval),
    value: interval
  };
}

export function packageTypeAsOption(packageType: string): PackageTypeOption {
  return {
    label: Display.packageType(packageType),
    value: packageType
  };
}

export class Display {
  static environment(value: Environment): string {
    return value === Environment.ONPREM ? "On-Premises" : "Cloud";
  }

  static billingInterval(value: BillingInterval): string {
    switch (value) {
      case BillingInterval.Annual:
        return "Annual";
      case BillingInterval.Monthly:
        return "Monthly";
    }
  }

  static packageType(value: string): string {
    return capitalize(value.toLocaleLowerCase());
  }
}
