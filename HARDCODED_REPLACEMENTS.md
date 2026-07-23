# Deployment Replacement Checklist

Review these values before production deployment.

## WeChat project

- `project.config.json` → `appid`
- WeChat business-domain allowlist → deployed viewer domain
- WeChat request-domain allowlist → scene API domain when API mode is enabled
- NFC capability and platform requirements for target devices

## Application configuration

Edit `config/index.js`:

- `appName`, `appVersion`, and `appDescription`
- `viewerBase`
- `useMock`
- `apiBase` and `apiEndpoints`
- `nfcAidList`
- default camera and viewer preferences
- storage keys only when planning a migration

## Scene catalog

Edit `data/catalog.js` or the production API data:

- scene and NFC identifiers
- English and Chinese metadata
- thumbnails
- model format and direct HTTPS URL
- rotation and camera framing
- tags, active state, and sort order

## Viewer hosting

- Deploy `viewer/` to Vercel or an equivalent HTTPS host.
- Confirm the model host permits the viewer origin through CORS.
- Redeploy after changing `viewer/src/` or `viewer/index.html`.
- Test the deployed URL, not only the local Vite server.

## Assets and release

- Replace placeholder thumbnails.
- Compress avatar/icon images if package headroom becomes limited.
- Verify the Mini Program package remains below 2 MB.
- Review both locale dictionaries for product-specific terminology.
- Update privacy, support, and license information in Settings before public release.
