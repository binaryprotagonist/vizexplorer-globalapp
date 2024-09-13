import { MetadataItem, SisenseDash, SisenseDashboardFilters } from "./types";

type FilterUpdateOptions = {
  refresh?: boolean;
  save?: boolean;
};

export class SisenseFilterWrapper {
  filters: SisenseDashboardFilters;

  constructor(filters: SisenseDashboardFilters) {
    this.filters = filters;
  }

  items(): MetadataItem[] {
    return this.filters.$$items;
  }

  findByTitle(title: string): MetadataItem | undefined {
    return this.items().find((filter) => filter.jaql.title === title);
  }

  update(filter: MetadataItem, options?: FilterUpdateOptions) {
    const updateOptions = { refresh: true, save: false, ...options };
    this.filters.update(filter, updateOptions);
  }
}

export class SisenseDashWrapper {
  inner: SisenseDash;
  filters: SisenseFilterWrapper;

  constructor(dashboard: SisenseDash) {
    this.inner = dashboard;
    this.filters = new SisenseFilterWrapper(dashboard.$$model.filters);
  }

  id(): string {
    return this.inner.id;
  }

  destroy() {
    if (this.inner.$$model.$$destroyed) return;
    return this.inner.$$model.destroy();
  }
}
