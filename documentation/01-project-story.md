# 1. Project Story

## Objective

The project was created so a phone user could discover and interact with a 3D Gaussian model inside WeChat, either by choosing a scene or presenting an NFC tag linked to it.

## Chosen approach

The implementation separates the product into two applications:

1. A WeChat Mini Program handles native pages, NFC, navigation, bilingual UI, local storage, history, favorites, profile, settings, and sharing.
2. A Vite website handles WebGL rendering through Three.js and `@mkkellogg/gaussian-splats-3d`. WeChat embeds the deployed site in `<web-view>`.

The viewer currently supports PLY, SPLAT, and KSPLAT Gaussian-scene formats. Example model binaries are stored on Cloudflare R2 and downloaded directly by the deployed viewer.

## Development result

The current application includes:

- English and Simplified Chinese output with a persistent language choice.
- A searchable bilingual model catalog.
- Visible Details and Favorite actions plus a long-press action sheet.
- A separate model-description page.
- NFC-to-scene and catalog-to-scene navigation.
- History, favorites, profile, Settings, and local-data controls.
- Viewer quality, controls, auto-rotate, and reduced-motion preferences.
- Staged loading, camera presets, orbit/zoom/pan, help, and fullscreen viewer controls.
- Local mock catalog and optional scene API modes.

The phone always loads the configured deployed viewer URL. The local `viewer/` directory is used to develop and build that website, not as Mini Program runtime code.

