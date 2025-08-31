import type { StorybookConfig } from "@storybook/nextjs-vite";
// @ts-ignore - vite-plugin-svgr has no bundled types for this config file
import svgr from 'vite-plugin-svgr';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/nextjs-vite",
    "options": {}
  },
  "staticDirs": [
    "../public"
  ]
  ,
  async viteFinal(config) {
    // register vite-plugin-svgr so `.svg` files can be imported as React components in Storybook
  config.plugins = config.plugins || [];
  // cast to any to avoid type mismatches between different vite/rollup instances in monorepo setups
  config.plugins.push(svgr() as any);
    return config;
  }
};
export default config;