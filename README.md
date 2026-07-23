# NFC 3D Model Mini Program

A bilingual WeChat Mini Program for discovering and opening Gaussian splat models from a catalog or NFC tag. The Mini Program handles navigation, NFC, profile/settings, history, and favorites. A separately deployed Vite website renders the 3D scene inside `<web-view>`.

## Current features

- English and Simplified Chinese UI with saved language preference.
- Localized model titles, subtitles, descriptions, tags, errors, and viewer controls.
- NFC lookup by NFC ID or scene ID.
- Search across localized model metadata.
- Visible Details and Favorite actions on every Home model card.
- Long-press actions in this order: Details, add/remove Favorite, and Remove from history when applicable.
- Separate model-description page.
- History, favorites, nickname, and avatar persistence.
- Dedicated Settings page with profile, language, viewer preferences, storage controls, and app information.
- PLY, SPLAT, and KSPLAT rendering through Three.js and `@mkkellogg/gaussian-splats-3d`.
- Viewer camera presets, orbit/zoom/pan, auto-rotate, scripted orbit, distance control, staged loading, help, fullscreen, and background pause.
- Viewer quality modes and reduced-motion preference.
- Local mock catalog or optional HTTP scene API.

## Architecture

```text
WeChat Mini Program
  ├─ Home / History / Favorites / Settings / Description
  ├─ NFC and scene services
  ├─ Local storage and localization
  └─ Model page <web-view>
          │ generated HTTPS URL + scene/preferences
          ▼
Deployed Vite viewer (Vercel)
          │ direct HTTPS model request
          ▼
Model object storage (currently Cloudflare R2)
```

The local `viewer/` directory is development source. The Mini Program loads `config.viewerBase`, currently `https://3dgs-miniapp2.vercel.app/`; it does not execute local viewer files on a phone.

## Important directories

| Path | Purpose |
| --- | --- |
| `config/index.js` | Deployment and runtime defaults |
| `data/catalog.js` | Local bilingual scene catalog |
| `pages/` | Mini Program pages |
| `utils/i18n.js` | Language detection, translation, and error localization |
| `utils/locales/` | English and Simplified Chinese dictionaries |
| `utils/services/` | Scene, NFC, and local-library services |
| `utils/viewer/url-builder.js` | Viewer URL contract |
| `viewer/` | Separately built and deployed web viewer |
| `documentation/` | Detailed architecture, model, NFC, and deployment guides |
| `tests/smoke.js` | Dependency-free route, storage, NFC, locale, and URL checks |

## Mini Program setup

1. Open the repository root in WeChat Developer Tools.
2. Set the intended AppID in `project.config.json`.
3. Review `config/index.js`, especially `viewerBase`, NFC AIDs, API mode, and defaults.
4. Add the deployed viewer domain to the WeChat business-domain configuration.
5. Add the API domain to the request allowlist if `useMock` is false.
6. Test NFC on a supported physical device.

`project.config.json` excludes `viewer/`, `documentation/`, and Markdown files from the Mini Program upload. The estimated runtime source remains below the 2 MB main-package limit.

## Viewer development and deployment

```powershell
cd viewer
npm ci
npm run dev
```

Production build:

```powershell
cd viewer
npm run build
```

Recommended Vercel settings:

- Root Directory: `viewer`
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `dist`

After viewer changes, redeploy Vercel. Rebuilding `viewer/dist/` locally does not update the website by itself.

## Adding a scene

Add a record to `data/catalog.js`, or return the same shape from the API. Important fields are:

- `id`, `sceneId`, and optional `nfcId`
- localized `title`, `subtitle`, and `description`
- `thumbnail`, `type`, `format`, and direct HTTPS `modelUrl`
- `rotationDeg`, `cameraPreset`, zoom limits, and `orbitSpeed`
- `tags`, `active`, and `sortOrder`

Text may be `{ en: '...', 'zh-CN': '...' }` or a plain string for backward compatibility.

## Validation

Before release:

1. Run `node tests/smoke.js`.
2. Parse all JSON files and run JavaScript syntax checks.
3. Run `npm run build` in `viewer/`.
4. Clear WeChat Developer Tools cache and compile.
5. Test both languages and saved preferences.
6. Test catalog, details, favorites, history actions, and sharing.
7. Test NFC and viewer rendering on physical target devices.

See [documentation/README.md](./documentation/README.md) for detailed documentation and [HARDCODED_REPLACEMENTS.md](./HARDCODED_REPLACEMENTS.md) for deployment values.
