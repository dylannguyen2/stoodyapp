import type { StorybookConfig } from "@storybook/nextjs-vite";
import type { PluginOption } from 'vite';
import svgr from 'vite-plugin-svgr';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
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
    const plugins = config.plugins ?? [];
    plugins.push(svgr() as PluginOption);
    config.plugins = plugins;
    return config;
  }
};
export default config;
