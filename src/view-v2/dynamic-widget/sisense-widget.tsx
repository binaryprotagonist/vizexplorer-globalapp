import { Box } from "@mui/material";
import { DynamicWidgetMissing } from "./dynamic-widget-missing";
import { DynamicWidgetError } from "./dynamic-widget-error";
import { useEffect, useRef, useState } from "react";
import { Tooltip, Typography } from "@vizexplorer/global-ui-v2";
import { SisenseWidgetClass, useSisenseDashboardContext } from "view-v2/sisense";
import { useFnDebounce } from "../../view/utils";
import { DynamicWidgetLoading } from "./dynamic-widget-loading";

type SisenseWidgetProps = {
  id: string;
  title: string;
};

export function SisenseWidget({ id, title }: SisenseWidgetProps) {
  const { dashboard, loaded, loading, error } = useSisenseDashboardContext();
  const widget = dashboard?.inner.widgets.get(id);

  if (error) {
    return <DynamicWidgetError message={error.message} />;
  }

  if (!loaded || loading) {
    return <DynamicWidgetLoading />;
  }

  return widget ? (
    <SisenseWidgetRenderer widget={widget} />
  ) : (
    <DynamicWidgetMissing title={title} />
  );
}

type SisenseWidgetRendererProps = {
  widget: SisenseWidgetClass;
};

export function SisenseWidgetRenderer({ widget }: SisenseWidgetRendererProps) {
  const [internalError, setInternalError] = useState<string | null>(null);
  const debounceFn = useFnDebounce();
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!ref.current) return;
    const resizeObserver = new ResizeObserver(() => {
      debounceFn(() => {
        if (!widget.container) return;
        widget.redraw();
      }, 50);
    });
    resizeObserver.observe(ref.current);

    // A widget will automatically be initialized on dashboard load, but this is undone by calling `destroy`.
    // In the case the widget was previously destroyed, re-initialize the widget
    if (!widget.$$initialized) {
      widget.initialize();
    }

    // manually listen for queryend events to try detect interal widget errors
    // using `on` causes memory leak as there is no `off`, and `destroy` is pseudo - it doesn't remove event listeners
    widget.$$model.$$events.queryend.handlers.push(() => {
      const error = widget.$$model.$error;
      setInternalError(error?.error ? error.details : null);
    });

    if (!widget.container) {
      widget.container = ref.current;
    }

    widget.refresh();

    return () => {
      resizeObserver.disconnect();
      widget.destroy();
      widget.$$model.$$events.queryend.handlers.pop();
    };
  }, [ref, widget]);

  if (internalError) {
    return (
      <Tooltip title={internalError}>
        <Typography
          textAlign={"center"}
          color={"error"}
          fontWeight={500}
          sx={{ cursor: "default" }}
        >
          Failed to load widget
        </Typography>
      </Tooltip>
    );
  }

  // Sisense doesn't work well with flex or grid layouts. Try avoid if at all possible
  return (
    <Box
      data-testid={"sisense-widget"}
      ref={ref}
      overflow={"hidden"}
      style={{ height: "100%", width: "100%" }}
    />
  );
}
