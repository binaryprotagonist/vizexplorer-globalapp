import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { baseUrl } from "./utils";
import { routes } from "./view/routes";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
// don't lazy load swiper css as otherwise it will take priority over component styling
import "swiper/element/css/pagination";
import "swiper/element/css/navigation";

const router = createBrowserRouter(routes, { basename: baseUrl() });
const container = document.getElementById("root")!;
createRoot(container).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
