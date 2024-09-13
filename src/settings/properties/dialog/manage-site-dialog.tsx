import { ChangeEvent, useState } from "react";
import { Autocomplete, Box, TextField, useTheme } from "@mui/material";
import { GeneralDialog } from "../../../view/dialog";
import {
  useCreateSiteMutation,
  useUpdateSiteMutation,
  CreateSiteMutation,
  SiteFragmentDoc,
  SiteFragment
} from "generated-graphql";
import { ApolloError, ApolloCache, FetchResult } from "@apollo/client";
import { Currency } from "./currency";
import { defaultTimezone, getCurrencies, NO_CURRENCY } from "../../../view/utils";
import { SupportedCurrencyCode, TimeZoneOption } from "./types";
import { timezoneAsOption } from "../utils";
import timezones from "../../../view/utils/timezones";

type Props = {
  site?: SiteFragment;
  onClose: () => void;
};

function defaultCurrency(site?: SiteFragment): SupportedCurrencyCode {
  if (!site) return "USD";

  const currency = getCurrencies().find((cur) => cur.code === site.currency?.code);
  return currency ? currency.code : NO_CURRENCY.code;
}

function errorMessage(error: Error, name: string) {
  if (error instanceof ApolloError) {
    if (error.graphQLErrors[0]?.extensions?.code == "NAME_EXISTS") {
      return `Property ${name} already exists`;
    }
  }
  return error.message;
}

/**
 * Create new or update existing site
 * @param site property to update (don't provide to create new property)
 */
export function ManageSiteDialog({ site, onClose }: Props) {
  const theme = useTheme();
  const [name, setName] = useState<string>(site?.name || "");
  const [timezone, setTimezone] = useState<TimeZoneOption>(
    timezoneAsOption(defaultTimezone(site?.tz))
  );
  const [currency, setCurrency] = useState<SupportedCurrencyCode>(defaultCurrency(site));
  const [error, setError] = useState<Error | null>();
  const [createSite, { loading: creatingSite }] = useCreateSiteMutation({
    update: updateCache,
    onCompleted,
    onError
  });
  const [updateSite, { loading: updatingSite }] = useUpdateSiteMutation({
    onCompleted,
    onError
  });

  function updateCache(
    cache: ApolloCache<CreateSiteMutation>,
    { data }: FetchResult<CreateSiteMutation>
  ) {
    if (!data?.siteCreateV2) return;

    cache.modify({
      fields: {
        sites(existing = []) {
          const newSite = cache.writeFragment({
            data: data.siteCreateV2,
            fragment: SiteFragmentDoc
          });
          return [...existing, newSite];
        }
      }
    });
  }

  function onError(error: Error) {
    setError(error);
  }

  function onCompleted() {
    onClose();
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (error) setError(null);
    setName(event.target.value);
  }

  function handleClose() {
    if (creatingSite || updatingSite) return;
    onClose();
  }

  async function onClickSave() {
    const newName = name.trim();
    if (!newName || creatingSite || updatingSite) return;
    const currencyCode = currency === NO_CURRENCY.code ? undefined : currency;
    const tz = timezone.value;

    if (site) {
      const { id } = site;
      await updateSite({
        variables: {
          id,
          site: { name: newName, currencyCode, tz }
        }
      });
      return;
    }

    await createSite({
      variables: { input: { name: newName, currencyCode, tz } }
    });
  }

  return (
    <GeneralDialog
      data-testid={"manage-site-dialog"}
      open={true}
      onClose={handleClose}
      title={site ? "Edit Property" : "Add Property"}
      actions={[
        {
          content: "Cancel",
          disabled: creatingSite || updatingSite,
          color: "secondary",
          onClick: handleClose
        },
        {
          content: "Save",
          disabled: creatingSite || updatingSite || !name.trim(),
          variant: "contained",
          color: "primary",
          onClick: onClickSave
        }
      ]}
    >
      <Box display={"grid"} width={"350px"} rowGap={theme.spacing(2)}>
        <TextField
          fullWidth
          autoFocus
          data-testid={"property-name-input"}
          variant={"outlined"}
          label={"Property Name"}
          value={name}
          onChange={onInputChange}
          error={!!error}
          helperText={error ? errorMessage(error, name) : null}
          inputProps={{
            maxLength: "32"
          }}
        />
        <Autocomplete
          disableClearable
          data-testid={"timezone-input"}
          value={timezone}
          options={timezones.map(timezoneAsOption)}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(_, value) => setTimezone(value)}
          renderInput={(params) => (
            <TextField {...params} variant={"outlined"} label={"Time Zone"} />
          )}
        />
        <Currency currencyCode={currency} onChange={setCurrency} />
      </Box>
    </GeneralDialog>
  );
}
