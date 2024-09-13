import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { baseUrl } from "../../utils";

type Config = {
  pendo: {
    enabled: boolean;
    apiKey?: string;
    account?: {
      id: string;
      name: string;
    };
  };
  sisense: {
    url: string;
  };
};

const ConfigContext = createContext<Config | null>(null);

type Props = {
  children: ReactNode;
};

async function loadConfig(): Promise<Config> {
  const response = await fetch(`${baseUrl()}config.json`);
  const config = await response.json();

  return config;
}

export function ConfigProvider(props: Props) {
  const [config, setConfig] = useState<Config | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadConfig().then(setConfig, setError);
  }, []);

  if (error) {
    throw new Error(`Invalid Config: ${error.message || "unknown"}`);
  }

  if (!config) {
    return null;
  }

  return <ConfigContext.Provider value={config}>{props.children}</ConfigContext.Provider>;
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) {
    throw Error("Missing Config Context");
  }

  return ctx;
}
