// Deployment-specific values. Keep runtime logic out of this file.
module.exports = {
  appName: 'NFC 3D Model Viewer',
  appVersion: '1.1.0',
  appDescription: 'Open interactive Gaussian splat and point-cloud scenes from the catalog or an NFC tag.',

  useMock: true,
  apiBase: 'https://api.example.com',
  viewerBase: 'https://3dgs-miniapp2.vercel.app/',
  apiEndpoints: {
    sceneById: '/api/scenes/',
    sceneByNfcId: '/api/scenes/by-nfc/'
  },

  nfcAidList: ['F222222222'],
  storageKeys: {
    viewHistory: 'viewHistory',
    favorites: 'favoriteModels',
    profile: 'userProfile',
    viewerPreferences: 'viewerPreferences'
  },
  defaultUser: {
    name: 'NFC User',
    avatar: '/images/default-avatar.png'
  },
  defaultCamera: {
    target: [0, 1.2, 0],
    distance: 3.5,
    minDistance: null,
    maxDistance: null,
    orbitSpeed: 1
  },
  defaultViewerPreferences: {
    autoRotate: false,
    reducedMotion: false,
    showControls: true,
    quality: 'auto'
  },
  viewerTitle: '3D Model Viewer',
  defaultThumbnail: '/images/default-avatar.png',
  historyLimit: 100,
  tabBar: {
    color: '#94A3B8', selectedColor: '#3B82F6', backgroundColor: '#FFFFFF', borderStyle: 'black',
    icons: { home: 'assets/icons/home.png', homeActive: 'assets/icons/home-active.png', history: 'assets/icons/collect.png', historyActive: 'assets/icons/collect-active.png', favorite: 'assets/icons/collect.png', favoriteActive: 'assets/icons/collect-active.png' }
  },
  window: {
    navigationBarTitleText: 'NFC 3D Model Viewer', navigationBarBackgroundColor: '#F8FAFC', navigationBarTextStyle: 'black', backgroundColor: '#F8FAFC', backgroundTextStyle: 'light'
  }
}
