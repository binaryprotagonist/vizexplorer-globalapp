import "@testing-library/jest-dom";
import { enableFetchMocks } from "jest-fetch-mock";
import { configure } from "@testing-library/dom";
import failOnConsole from "jest-fail-on-console";

failOnConsole();
enableFetchMocks();
configure({ asyncUtilTimeout: 2000 });

/** Return Auckland as the timezone instead of the system */
const DateTimeFormat = Intl.DateTimeFormat;
jest
  .spyOn(global.Intl, "DateTimeFormat")
  .mockImplementation(
    (locale, options) =>
      new DateTimeFormat(locale, { ...options, timeZone: "Pacific/Auckland" })
  );

// TODO: General overwrite of `import.meta.x` functions
jest.mock("./src/utils", () => ({
  isAdminBuild: () => false,
  baseUrl: () => ""
}));

Object.defineProperty(window, "ResizeObserver", {
  configurable: true,
  value: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }))
});

Element.prototype.scrollIntoView = () => {};

// SwiperJS
class MockSwiperContainer extends HTMLElement {
  initialize() {}
  swiper = {
    params: {},
    slides: [],
    update() {},
    on() {}
  };
}
jest.mock("swiper/element/bundle", () => ({
  register: () => {
    if (!globalThis.customElements.get("swiper-container")) {
      globalThis.customElements.define("swiper-container", MockSwiperContainer);
    }
  }
}));
jest.mock("swiper/element/css/pagination", () => {});
jest.mock("swiper/element/css/navigation", () => {});
