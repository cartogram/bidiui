import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
    experimental: {
        fonts: [{
            provider: fontProviders.google(),
            name: "Readex Pro",
            cssVariable: "--font-readex-pro",
            weights: [100, 200, 300, 400, 500, 600, 700, 800, 900]

        }]
    }
});