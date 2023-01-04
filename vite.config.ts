import path from 'path';
import type { ConfigEnv } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import solid from 'vite-plugin-solid';
import webExtension, { readJsonFile } from 'vite-plugin-web-extension';
import tsconfigPaths from 'vite-tsconfig-paths';

const IS_DEV = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '') || 3309;
const root = (...paths: string[]) => path.resolve(__dirname, ...paths);

export default ({ mode }: ConfigEnv) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    root: root('src'),
    base: IS_DEV ? `http://localhost:${port}/` : undefined,
    // Configure our outputs - nothing special, this is normal vite config
    build: {
      minify: 'terser',
      sourcemap: IS_DEV ? 'inline' : false,
      outDir: root('dist'),
      emptyOutDir: true,
      target: 'esnext',
    },
    // Add the webExtension plugin
    plugins: [
      tsconfigPaths(),
      solid(),
      webExtension({
        // A function to generate manifest file dynamically.
        manifest: () => {
          const packageJson = readJsonFile('./package.json');

          // Convert from Semver (example: 0.1.0-beta6)
          const [major = '0', minor = '0', patch = '0', label = '0'] =
            packageJson.version
              // can only contain digits, dots, or dash
              .replace(/[^\d.-]+/g, '')
              // split into version parts
              .split(/[.-]/);

          return {
            ...readJsonFile('./src/manifest.json'),
            version: `${major}.${minor}.${patch}.${label}`,
            name: packageJson.displayName ?? packageJson.name,
            description: packageJson.description,
            // this is required on dev for Vite script to load
            content_security_policy: {
              extension_pages: IS_DEV
                ? `script-src \'self\' http://localhost:${port}; object-src \'self\'`
                : undefined,
            },
          };
        },
        assets: 'assets',
        browser: process.env.DEV_FIREFOX ? 'firefox' : 'chrome',
        watchFilePaths: [
          root('src/manifest.json'),
          root('postcss.config.cjs'),
          root('tailwind.config.cjs'),
        ],
        // additionalInputs: [
        //   'components/EventsPage/ToolbarActions/index.ts',
        //   'components/EventsPage/EventCheckbox/index.ts',
        // ],
        webExtConfig: {
          chromiumBinary: process.env.VITE_CHROMIUM_BINARY,
          chromiumProfile: process.env.VITE_CHROMIUM_PROFILE,
          firefoxBinary: process.env.VITE_FIREFOX_BINARY,
          firefoxProfile: process.env.VITE_FIREFOX_PROFILE,
          startUrl: ['https://frigate.peanutbutterporkchop.com'],
          watchIgnored: ['*.md', '*.log'],
          keepProfileChanges: true,
          browserConsole: true,
          args: ['--start-maximized'],
        },
      }),
    ],
    define: {
      __DEV__: IS_DEV,
    },
    server: {
      //port,
      hmr: {
        host: 'localhost',
      },
    },
  });
};
