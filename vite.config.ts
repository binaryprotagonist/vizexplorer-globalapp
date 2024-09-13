import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({ jsxImportSource: "@emotion/react" })],
  define: {
    "import.meta.env.VITE_ENABLE_ADMIN": false
  },
  resolve: {
    alias: [
      {
        find: "generated-graphql",
        replacement: path.resolve(__dirname, "./src/view/graphql/generated/graphql")
      },
      {
        find: "view-v2",
        replacement: path.resolve(__dirname, "./src/view-v2")
      }
    ]
  },
  publicDir: "public/app",
  build: {
    assetsDir: "global/assets",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@mui")) {
            return "vendor-mui";
          }
          if (id.includes("@emotion")) {
            return "vendor-emotion";
          }
          if (id.includes("intl-tel-input")) {
            return "vendor-intl-tel-input";
          }
        }
      }
    }
  },
  server: {
    port: 80,
    proxy: {
      "/global": {
        target: "https://apps.vizexplorer.dev",
        changeOrigin: true
      },
      "/auth/sso/": {
        target: "https://apps.vizexplorer.dev",
        changeOrigin: true
      }
    }
  }
});
