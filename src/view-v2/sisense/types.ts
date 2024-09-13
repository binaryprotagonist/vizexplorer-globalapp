export type SisenseWindow = {
  connect: (url: string, saveChanges: boolean) => Promise<SisenseApp>;
  internalScope: SisenseInternalScope;
};

export type SisenseApp = {
  initialized: boolean;
  serverUrl: string;
  dashboards: SisenseAppDashboard;
  $$dashboards: {
    $$dashboards: SisenseDash[];
  };
};

export type SisenseAppDashboard = {
  load: (dashboardId: string) => Promise<SisenseDash>;
};

export type SisenseDash = {
  id: string;
  datasource: any;
  refreshing: boolean;
  widgets: SisenseDashWidget;
  $$model: SisenseDashboard;
};

export type SisenseDashWidget = {
  get: (widgetId: string) => SisenseWidgetClass | null | undefined;
  $$widgets: SisenseWidgetClass[];
};

export type SisenseDashboard = {
  $$destroyed: boolean;
  oid: string;
  title: string;
  initialized: boolean;
  datasource: any;
  filters: SisenseDashboardFilters;
  widgets: SisenseDashWidget;
  autoUpdateOnFiltersChange: boolean;
  refresh: () => Promise<void>;
  destroy: VoidFunction;
};

export type SisenseDashboardFilters = {
  $$items: MetadataItem[];
  update: (filter: any, options: DashboardFilterOptions) => void;
};

export type MetadataItem = {
  jaql: {
    dim: string;
    title: string;
    filter?: JaqlFilter;
    level?: "days";
  };
};

export type JaqlUpdate = {
  filter: JaqlFilter;
  level?: "days";
};

export type JaqlFilter =
  | { members?: string[]; all?: boolean; exclude?: { members?: string[]; all?: boolean } }
  | JaqlFilterDateRange;

export type JaqlFilterDateRange = {
  from: string;
  to: string;
};

export type DashboardFilterOptions = {
  refresh: boolean;
  save: boolean;
};

export type SisenseWidgetClass = {
  id: string;
  title: string;
  metadata: SisenseWidgetMetaData;
  container?: HTMLDivElement;
  $$model: SisenseWidget;
  $$initialized: boolean;
  refresh: () => Promise<void>;
  redraw: VoidFunction;
  destroy: VoidFunction;
  initialize: VoidFunction;
};

export type SisenseWidget = {
  oid: string;
  title: string;
  datasource: any;
  initialized: boolean;
  refreshing: boolean;
  metadata: SisenseWidgetMetaData;
  type: SisenseWidgetType;
  $$events: SisenseWidgetEvents;
  $error?: SisenseWidgetError;
  refresh: () => Promise<void>;
  destroy: VoidFunction;
};

// incomplete list - add more as needed
export type SisenseWidgetType = "indicator" | "chart/line";

export type SisenseWidgetEvents = {
  queryend: SisenseWidgetEvent;
};

export type SisenseWidgetEvent = {
  handlers: VoidFunction[];
};

export type SisenseWidgetError = {
  error: boolean;
  errorSource: string;
  details: string;
};

export type SisenseWidgetMetaData = {
  panels: SisenseWidgetMetadataPanel[];
};

export type SisenseWidgetMetadataPanel = {
  items: SisenseMetadataItem[];
};

export type SisenseMetadataItem = {
  format?: {
    mask?: {
      currency?: {
        symbol?: string;
      };
    };
  };
};

type SisenseInternalScope = {
  prism: Prism;
};

export type Prism = {
  vodCurrencyUpdate: (currency?: string) => void;
  vodEnableDynamicElasticube?: (sisense: SisenseApp) => void;
};

export type SisenseDashboardFilter = {
  fieldTitle: string;
  value: JaqlUpdate;
};
