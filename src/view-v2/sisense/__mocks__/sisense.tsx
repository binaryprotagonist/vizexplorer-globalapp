import { SisenseCtx } from "../sisense-context";
import { SisenseDashWrapper } from "../sisense-dash-wrapper";
import {
  SisenseDashboard,
  SisenseMetadataItem,
  SisenseApp,
  SisenseDash,
  SisenseWidgetClass,
  SisenseWidget,
  Prism
} from "../types";

export function generateDummySisenseWidget(length = 3): SisenseWidget[] {
  return Array(length)
    .fill(null)
    .map<SisenseWidget>((_, idx) => ({
      oid: `widget-${idx + 1}`,
      title: `Widget ${idx + 1}`,
      initialized: true,
      refreshing: false,
      type: idx % 2 === 0 ? "indicator" : "chart/line",
      datasource: {},
      metadata: {
        panels: [{ items: generateDummySisenseMetadataItems() }]
      },
      $$events: {
        queryend: { handlers: [] }
      },
      destroy: jest.fn(),
      refresh: jest.fn()
    }));
}

export function generateDummySisenseWidgetClass(length = 3): SisenseWidgetClass[] {
  const widgets = generateDummySisenseWidget(length);

  return Array(length)
    .fill(null)
    .map<SisenseWidgetClass>((_, idx) => ({
      id: widgets[idx].oid,
      title: widgets[idx].title,
      metadata: widgets[idx].metadata,
      $$model: widgets[idx],
      $$initialized: true,
      refresh: jest.fn(),
      destroy: jest.fn(),
      initialize: jest.fn(),
      redraw: jest.fn()
    }));
}

function generateDummySisenseMetadataItems(length = 3): SisenseMetadataItem[] {
  return Array(length)
    .fill(null)
    .map(() => ({
      format: {
        mask: {
          currency: {
            symbol: "€"
          }
        }
      }
    }));
}

export function generateDummySisenseDashboards(length = 1): SisenseDashboard[] {
  const widgetClasses = generateDummySisenseWidgetClass();

  return Array(length)
    .fill(null)
    .map<SisenseDashboard>((_, idx) => ({
      $$destroyed: false,
      oid: `dashboard-${idx + 1}`,
      title: `Dashboard ${idx + 1}`,
      widgets: {
        $$widgets: widgetClasses,
        get: (_id: string) => widgetClasses[0]
      },
      initialized: true,
      filters: {
        update: jest.fn(),
        $$items: []
      },
      datasource: {} as any,
      autoUpdateOnFiltersChange: true,
      refresh: jest.fn(),
      destroy: jest.fn()
    }));
}

export function generateDummySisenseDashs(length = 1): SisenseDash[] {
  const dashboards = generateDummySisenseDashboards(length);
  return Array(length)
    .fill(null)
    .map<SisenseDash>((_, idx) => ({
      id: dashboards[idx].oid,
      widgets: dashboards[idx].widgets,
      refreshing: false,
      datasource: dashboards[idx].datasource,
      $$model: dashboards[idx]
    }));
}

export function generateDummySisenseDashWrappers(length = 1): SisenseDashWrapper[] {
  return generateDummySisenseDashs(length).map((dash) => new SisenseDashWrapper(dash));
}

export function generateMockSisenseApp(): SisenseApp {
  const dashboards = generateDummySisenseDashs();

  return {
    serverUrl: "/odr",
    initialized: true,
    $$dashboards: {
      $$dashboards: dashboards
    },
    dashboards: {
      load: async (_id: string) => dashboards[0]
    }
  };
}

export const mockSisensePrism: Prism = {
  vodCurrencyUpdate: jest.fn()
};

export const mockSisenseCtx: SisenseCtx = {
  ready: true,
  sisense: generateMockSisenseApp(),
  prism: mockSisensePrism,
  init: jest.fn()
};
