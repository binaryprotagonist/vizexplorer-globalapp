import { gql } from "@apollo/client";
import { ApplicationSelectAppFragment } from "./__generated__/application-select";
import { Autocomplete, TextField } from "@vizexplorer/global-ui-v2";
import { CheckmarkOption } from "view-v2/select/components/checkmark-option";

type Props = {
  selected: ApplicationSelectAppFragment | null;
  options: ApplicationSelectAppFragment[];
  disabled?: boolean;
  onChange: (app: ApplicationSelectAppFragment) => void;
};

export function ApplicationSelect({ selected, options, disabled, onChange }: Props) {
  return (
    <Autocomplete
      disableClearable
      data-testid={"application-select"}
      // @ts-ignore allow null
      value={selected}
      options={options}
      disabled={disabled}
      onChange={(_, app) => onChange(app)}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
      renderOption={(props, option) => {
        return (
          <CheckmarkOption
            {...props}
            startAdornment={<AppIcon url={option.icon} />}
            option={option.name}
            selected={selected?.id === option.id}
          />
        );
      }}
      renderInput={({ InputProps, ...rest }) => (
        <TextField
          {...rest}
          placeholder={"Select application"}
          InputProps={{
            ...InputProps,
            startAdornment: selected && <AppIcon url={selected.icon} />
          }}
        />
      )}
    />
  );
}

ApplicationSelect.fragments = {
  applicationSelectApp: gql`
    fragment ApplicationSelectApp on Application {
      id
      name
      icon
    }
  `
};

type AppIconProps = {
  url: string;
  alt?: string;
};

function AppIcon({ url, alt = "" }: AppIconProps) {
  return <img data-testid={"app-icon"} src={url} alt={alt} width={24} height={24} />;
}
