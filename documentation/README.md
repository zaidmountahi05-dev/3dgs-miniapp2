# Project Documentation

This documentation describes the current bilingual NFC 3D Model Mini Program.

- [01-project-story.md](./01-project-story.md) — goal, approach, and completed result.
- [02-architecture-and-pipeline.md](./02-architecture-and-pipeline.md) — components and runtime flows.
- [03-web-viewer-and-models.md](./03-web-viewer-and-models.md) — formats, controls, preferences, and deployment boundary.
- [04-nfc-data-and-library.md](./04-nfc-data-and-library.md) — NFC parsing, scene sources, storage, actions, and localization.
- [05-setup-deployment-and-testing.md](./05-setup-deployment-and-testing.md) — setup, deployment, package size, and release checks.

## Current product summary

The Mini Program provides Home, History, Favorites, Settings, Model Details, and 3D Model pages in English and Simplified Chinese. The 3D renderer is a separate hosted Vite application. Current model files are served from Cloudflare R2, and the viewer is configured to load from Vercel.

