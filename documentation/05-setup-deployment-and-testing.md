# 5. Setup, Deployment, and Testing

## Mini Program setup

1. Open the repository root in WeChat Developer Tools.
2. Set the correct AppID in `project.config.json`.
3. Review `config/index.js`.
4. Configure the deployed viewer as a permitted business domain.
5. Configure the API request domain if API mode is enabled.
6. Clear Developer Tools cache after changing package rules or stale analyzer state.

## Viewer development

```powershell
cd viewer
npm ci
npm run dev
```

Build with:

```powershell
npm run build
```

Deploy `viewer/` independently. For Vercel, use `viewer` as the root, `npm ci` as install command, `npm run build` as build command, and `dist` as output.

## Model hosting

Upload compatible PLY/SPLAT/KSPLAT files to an HTTPS object host. Configure CORS for the deployed viewer origin, use a direct object URL in the scene, and test download/memory behavior on target phones.

## Mini Program package size

WeChat's main package has a 2 MB source limit for this workflow. `project.config.json` excludes:

- `viewer/`
- `documentation/`
- Markdown files
- `tests/`

These files are not Mini Program runtime dependencies. The estimated package is currently about 1.48 MB, mostly because of bundled avatars. Compress image assets before adding substantial new runtime code.

## Release checks

- Run `node tests/smoke.js`.
- Validate every JSON file.
- Check syntax and load all CommonJS modules with a mocked `wx` environment.
- Verify every translation key exists in both locales.
- Test language switching and persistence.
- Test Home card tap, visible Details/Favorite buttons, and long-press action order.
- Test Description-to-viewer navigation.
- Test history/favorite add, remove, clear, and reset behavior.
- Build the Vite viewer and deploy it.
- Verify viewer language, quality, reduced motion, help, fullscreen fallback, controls, and messages.
- Test NFC on physical Android/HarmonyOS devices supported by WeChat's selected API.
- Test slow network, missing scene, API error, model error, and CORS failure states.

## Troubleshooting

### Source exceeds 2 MB

Confirm the `packOptions.ignore` rules are active, clear Developer Tools cache, and recompile. Do not include the separately deployed viewer bundle in the Mini Program package.

### Analyzer ignores a required module

Disable “Ignore unused files” in local Developer Tools settings, clear cache, and rebuild. Later “page not registered” messages can be secondary effects of the first missing import.

### Viewer changes do not appear

`<web-view>` loads the deployment URL. Run the viewer build and redeploy Vercel; a local `dist/` build alone does not update the deployed website.

### Model does not render

Verify HTTPS reachability, CORS, file format compatibility, URL parameters, WebGL support, and camera/rotation configuration.

### NFC is unavailable

The desktop simulator cannot fully validate NFC. Confirm phone hardware, OS behavior, WeChat version, SDK/base library, NFC state, and the configured AID on a physical device.
