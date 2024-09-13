import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Alert } from "./alert";
import { AlertProps, NewAlert } from "./types";

type AlertCtx = {
  addAlert: (alert: NewAlert, skipQueue?: boolean) => void;
  removeAlert: (id: string) => void;
};

const AlertContext = createContext<AlertCtx | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [activeAlert, setActiveAlert] = useState<AlertProps>({ open: false });
  const [alertQueue, setAlertQueue] = useState<AlertProps[]>([]);
  const pendingAlerts = useRef<AlertProps[]>([]);

  function addAlert(alert: NewAlert, skipQueue = false) {
    if (skipQueue) {
      setActiveAlert((cur) => ({ ...cur, open: false }));
      setAlertQueue((cur) => [{ open: true, ...alert }, ...cur]);
    } else {
      setAlertQueue((cur) => [...cur, { open: true, ...alert }]);
    }
  }

  function removeAlert(id: string) {
    setAlertQueue((cur) => cur.filter((alert) => alert.id !== id));
    if (activeAlert.id === id) {
      setActiveAlert((cur) => ({ ...cur, open: false }));
    }
  }

  useEffect(() => {
    // track any alerts not yet dismissed/handled to handle the event this component unmounts
    pendingAlerts.current = [...alertQueue];
    if (activeAlert.open) {
      pendingAlerts.current.unshift(activeAlert);
    }

    // if the active alert is closed, and there are more alerts in the queue, set the next alert as active
    if (!activeAlert.open && alertQueue.length > 0) {
      setActiveAlert(alertQueue[0]);
      setAlertQueue((cur) => cur.slice(1));
    }
  }, [activeAlert, alertQueue]);

  // run any onClose callbacks when the component unmounts
  useEffect(() => {
    return () => {
      if (!pendingAlerts.current.length) return;
      pendingAlerts.current.forEach((alert) => {
        alert.onClose?.("unmount");
      });
    };
  }, []);

  const { onClose, ...rest } = activeAlert;

  return (
    <AlertContext.Provider value={{ addAlert, removeAlert }}>
      <Alert
        key={activeAlert?.message}
        data-testid={"alert"}
        onClose={(_e, reason) => {
          if (reason === "clickaway" || reason === "escapeKeyDown") return;
          onClose?.(reason);
          setActiveAlert((cur) => ({ ...cur, open: false }));
        }}
        // automatically close alerts whenever actions are clicked. could be better we make this optional, but could be extended later
        onActionClick={() => setActiveAlert((cur) => ({ ...cur, open: false }))}
        {...rest}
      />
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error("Missing AlertProvider");
  }
  return ctx;
}
