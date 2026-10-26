import vinext from "vinext";
import { defineConfig } from "vite";
import { sites } from "./scripts/vite/sites-vite-plugin";
export default defineConfig(async () => {
  const { cloudflare } = await import("@cloudflare/vite-plugin");
  return {
    plugins: [
      vinext(),
      sites({ mockAuth: false }),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        inspectorPort: false,
        config: {
          name: "oak-outpost-storefront",
          main: "./worker/index.ts",
          compatibility_date: "2026-05-15",
          compatibility_flags: ["nodejs_compat"],
        },
      }),
    ],
  };
});
