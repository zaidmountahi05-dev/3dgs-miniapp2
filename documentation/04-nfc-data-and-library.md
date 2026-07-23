# 4. NFC, Scene Data, Localization, and Storage

## NFC payloads

The parser accepts:

- A response containing `sceneId` or `nfcId`.
- A UTF-8 ArrayBuffer containing JSON with either field.
- Plain UTF-8 text, treated as an NFC ID.

NFC IDs are trimmed and uppercased. Invalid JSON returns an empty payload instead of continuing with untrusted text.

## Scene schema

| Field | Purpose |
| --- | --- |
| `id`, `sceneId` | Stable scene identifier |
| `nfcId` | Optional tag mapping |
| `title`, `subtitle`, `description` | Plain text or `{ en, zh-CN }` objects |
| `thumbnail` | Mini Program image path |
| `type`, `format` | Scene classification and PLY/SPLAT/KSPLAT format |
| `modelUrl` | Direct HTTPS model object URL |
| `viewerUrl` | Optional complete viewer URL override |
| `rotationDeg` | Source-orientation correction |
| `cameraPreset` | Initial target and distance |
| `minDistance`, `maxDistance`, `orbitSpeed` | Camera controls |
| `tags` | Search metadata; entries may also be localized |
| `active`, `sortOrder` | Availability and catalog order |

## Scene sources

With `config.useMock = true`, lookups use `data/catalog.js`. With API mode enabled, the Mini Program requests scene-by-ID and scene-by-NFC-ID endpoints. Transport and response errors receive stable codes and are converted into English or Chinese messages by the localization service.

## Localization

The initial locale follows the WeChat/device language. A saved explicit choice takes priority. `utils/i18n.js` provides dictionary lookup, interpolation, localized scene fields, localized service errors, and dynamic tab/navigation titles.

The selected locale is included in the viewer URL, so the web viewer and Mini Program stay synchronized.

## Local storage

The following data is stored only in the current WeChat storage context:

- Browsing history
- Favorites
- User profile
- Viewer preferences
- Language preference

History is deduplicated by scene and limited to the configured maximum. A recent item can be removed individually through the Home long-press menu, or history can be cleared from History/Settings. Favorites can be toggled from Home, Description, Model, and Favorites pages.

Settings provides confirmed actions to clear history, clear favorites, or reset all local application data.

