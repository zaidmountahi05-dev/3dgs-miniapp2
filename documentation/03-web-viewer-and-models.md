# 3. Web Viewer and Models

## Stack

- Vite builds the website in `viewer/`.
- Three.js provides WebGL, camera math, and `OrbitControls`.
- `@mkkellogg/gaussian-splats-3d` loads and renders PLY, SPLAT, and KSPLAT scenes.

The configured deployed site is `https://3dgs-miniapp2.vercel.app/`. Local files only affect the phone after the viewer is rebuilt and redeployed.

## Loading and rendering

The viewer parses URL parameters, initializes WebGL and the camera, configures controls, selects the Gaussian scene format, applies model rotation, progressively loads the model, and starts the animation loop. Staged status and progress UI distinguishes initialization from model download/processing and readiness.

The renderer limits pixel ratio based on the saved quality mode:

- Performance: maximum pixel ratio 1
- Automatic: maximum pixel ratio 1.5
- High quality: maximum pixel ratio 2

Rendering is skipped while the browser document is hidden. Reduced motion disables initial auto-rotation and prevents motion buttons from enabling automatic movement.

## User controls

- Orbit, zoom, and pan gestures
- Front, left, right, top, and reset presets
- Auto-rotate and scripted orbit
- Camera-distance slider
- Show/hide controls
- Bilingual help panel
- Browser fullscreen where the WebView/platform allows it

## Viewer messages

The website sends `viewer-ready`, `viewer-error`, `camera-changed`, and `camera-preset` messages. Camera reports are throttled. The Mini Program displays localized ready/error feedback.

## Model requirements

Use a direct HTTPS URL and a file compatible with the GaussianSplats3D loader. Arbitrary OBJ/GLB mesh files are not supported by this renderer. The model host must allow the deployed viewer origin through CORS.

Each scene can tune rotation, camera target/distance, zoom limits, and orbit speed. Always verify orientation and memory/performance on representative phones.

