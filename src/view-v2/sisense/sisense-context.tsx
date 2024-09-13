import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useConfig } from "../../view/config";
import { Prism, SisenseApp, SisenseWindow } from "./types";
import { loadSisenseScript } from "./utils";

declare global {
  interface Window {
    Sisense: SisenseWindow;
  }
}

export type SisenseCtx = {
  sisense?: SisenseApp;
  prism?: Prism;
  ready: boolean;
  init: VoidFunction;
};

export const SisenseContext = createContext<SisenseCtx | null>(null);

export function SisenseProvider({ children }: { children: React.ReactNode }) {
  const { sisense: sisenseConf } = useConfig();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [sisense, setSisense] = useState<SisenseApp>();
  const [prism, setPrism] = useState<Prism>();
  const initializing = useRef(false);

  const init = useCallback(async () => {
    if (ready || initializing.current) return;

    if (!sisenseConf.url) {
      setError(new Error("Sisense URL not configued"));
      return;
    }

    initializing.current = true;
    loadSisenseScript(sisenseConf.url)
      .then((app) => {
        const prism = window.Sisense.internalScope.prism;
        if (prism.vodEnableDynamicElasticube) {
          prism.vodEnableDynamicElasticube(app);
        }
        setPrism(prism);
        setSisense(app);
        setReady(true);
      })
      .catch(setError)
      .finally(() => {
        initializing.current = false;
      });
  }, [sisenseConf, ready]);

  const ctxProps = useMemo<SisenseCtx | null>(
    () => ({ sisense, prism, ready, init }),
    [sisense, prism, ready, init]
  );

  if (error) throw error;

  return <SisenseContext.Provider value={ctxProps}>{children}</SisenseContext.Provider>;
}

export function useSisense(autoInit = true) {
  const ctx = useContext(SisenseContext);

  useEffect(() => {
    if (autoInit && ctx && !ctx.ready) {
      ctx.init();
    }
  }, [ctx, autoInit]);

  if (!ctx) throw Error("Sisense Context not configured");

  return ctx;
}
