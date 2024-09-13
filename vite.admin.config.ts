import appConfig from "./vite.config";
import { defineConfig, mergeConfig } from "vite";

// https://vitejs.dev/config/
const adminConfig = defineConfig({
  base: "/admin/",
  publicDir: "public/admin",
  define: {
    "import.meta.env.VITE_ENABLE_ADMIN": true
  },
  build: {
    assetsDir: "assets"
  }
});

export default mergeConfig(appConfig, adminConfig, false);
