# 2. Architecture and Pipeline

## Mini Program pages

| Page | Responsibility |
| --- | --- |
| `pages/index` | Profile summary, NFC, search, catalog, recent items, favorites, quick actions, and long-press actions |
| `pages/description` | Localized scene metadata and entry to the viewer |
| `pages/model` | Viewer URL generation, `<web-view>`, viewer events, and favorite state |
| `pages/history` | Local browsing history |
| `pages/favorite` | Saved favorites |
| `pages/settings` | Profile, language, viewer preferences, storage/privacy controls, and app information |

## Shared layers

- `utils/i18n.js` selects a locale, translates keys, interpolates values, localizes service errors, and updates navigation labels.
- `utils/locales/` contains the English and Simplified Chinese dictionaries.
- `utils/scene.js` converts local/API records into the scene shape used by pages.
- `utils/services/model-service.js` selects the local catalog or remote API.
- `utils/services/library-service.js` owns history, favorites, profile, and viewer preferences.
- `utils/services/nfc-service.js` decodes and normalizes NFC payloads.
- `utils/navigation.js` centralizes page routes.
- `utils/viewer/url-builder.js` serializes a scene and viewer options into the hosted viewer URL.

## Catalog flow

1. Home loads normalized scenes.
2. Search filters localized title, subtitle, description, and tags.
3. A card tap opens the viewer; Details opens the description page.
4. A long press shows Details, add/remove Favorite, and—only for a recent item—Remove from history.
5. The model page resolves the scene, records history once, and generates the viewer URL.
6. `<web-view>` loads the deployed viewer, which downloads the model file.

## NFC flow

1. Home checks HCE support and the SDK version.
2. `wx.startHCE` starts with the configured AID list.
3. The message parser accepts direct fields, UTF-8 JSON, or a plain NFC ID.
4. The scene service resolves the NFC ID or scene ID.
5. Duplicate messages are guarded while processing.
6. History is updated and the normal model page opens.
7. HCE and listeners are stopped when the page hides, unloads, or a scan succeeds.

## Viewer URL contract

The generated URL carries scene ID, localized title/subtitle, type, format, model URL, camera target/distance, rotation, zoom limits, orbit speed, language, auto-rotate, reduced motion, controls visibility, and quality mode.

## Deployment boundary

`viewer/` is excluded from the WeChat upload package. It must be independently deployed. Model binaries are also external; they are never bundled into the Mini Program.

