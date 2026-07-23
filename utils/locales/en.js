module.exports = {
  appName: 'NFC 3D Model Viewer',
  tabs: { home: 'Explore', history: 'History', favorites: 'Favorites' },
  common: { yes: 'Yes', no: 'No', cancel: 'Cancel', confirm: 'Confirm', retry: 'Retry', clear: 'Clear', delete: 'Delete' },
  errors: { missingSceneId: 'Missing scene ID', missingNfcId: 'Missing NFC ID', modelNotFound: 'Model not found', nfcModelNotFound: 'No model is linked to this NFC tag', invalidResponse: 'The server returned an invalid response', apiError: 'Server error ({details})' },
  home: {
    recentCount: 'Recently viewed: {count}', favoriteCount: 'Favorites: {count}', allCount: 'All models: {count}', settings: 'Settings',
    nfcStatus: 'NFC status', deviceSupported: 'Device supported:', scanning: 'Scanning:', search: 'Search names, descriptions, or tags',
    allModels: 'All models', recent: 'Recently viewed', favorites: 'Favorite models', noMatches: 'No matching models', noModels: 'No models available',
    tryKeywords: 'Try another keyword', addCatalog: 'Add a model to data/catalog.js first', noRecent: 'No recently viewed models',
    recentHint: 'Open a model from the catalog or an NFC tag', noFavorites: 'No favorite models', favoriteHint: 'Open a model and tap Favorite',
    scan: 'Start NFC scan', nfcUnsupported: 'This device does not support NFC scanning', wechatOld: 'The WeChat version is too old',
    approachTag: 'Hold the phone near the NFC tag', nfcStartFailed: 'Could not start NFC', systemInfoFailed: 'Could not read system information',
    invalidTag: 'The NFC tag could not be recognized', readFailed: 'Could not read the tag',
    viewDescription: 'Details', addFavorite: 'Add favorite', removeFavorite: 'Remove favorite', removeHistory: 'Remove from history', removedHistory: 'Removed from history', actions: 'Model actions'
  },
  history: { title: 'Browsing history', count: '{count} models', empty: 'No browsing history', hint: 'Models you open will appear here', explore: 'Explore models', lastViewed: 'Last viewed: {value}', clearTitle: 'Clear history?', clearMessage: 'This will remove all browsing history from this device.', cleared: 'History cleared' },
  favorites: { title: 'My favorites', count: '{count} models', empty: 'No favorite models', hint: 'Open a model and tap Favorite', explore: 'Explore models', type: 'Type: {value}', removeTitle: 'Remove favorite?', removeMessage: 'Remove “{name}” from favorites?', removed: 'Removed from favorites' },
  model: { loading: 'Loading model…', preparing: 'Preparing the 3D viewer', failed: 'Could not load model', favorite: 'Favorite', favorited: 'Favorited', added: 'Added to favorites', removed: 'Removed from favorites', ready: '3D viewer is ready', renderFailed: 'Rendering failed', type: 'Type: {value}', format: 'Format: {value}', sceneId: 'Scene ID: {value}', description: 'Description: {value}', missingId: 'Missing scene ID', shareTitle: '3D model', openViewer: 'Open 3D viewer', detailsTitle: 'Model details', tags: 'Tags' },
  settings: {
    title: 'Settings', profile: 'Profile', nickname: 'Nickname', changeNickname: 'Change nickname', chooseAvatar: 'Choose avatar', language: 'Language', languageHint: 'Choose the language used by the Mini Program and viewer', english: 'English', chinese: '简体中文',
    viewer: 'Viewer preferences', autoRotate: 'Auto-rotate by default', reducedMotion: 'Reduce motion', showControls: 'Show viewer controls', quality: 'Rendering quality', qualityAuto: 'Automatic', qualityPerformance: 'Performance', qualityHigh: 'High quality',
    storage: 'Storage and privacy', localOnly: 'Profile, language, history, favorites, and viewer preferences are stored on this device.', clearHistory: 'Clear history', clearFavorites: 'Clear favorites', resetAll: 'Reset all local data', clearFavoritesTitle: 'Clear favorites?', clearFavoritesMessage: 'This will remove all favorites from this device.', resetTitle: 'Reset all data?', resetMessage: 'This removes profile, language, history, favorites, and viewer preferences from this device.', done: 'Completed',
    about: 'Mini Program information', version: 'Version', formats: 'Supported formats', technology: 'Viewer technology', appDescription: 'Open interactive Gaussian splat and point-cloud scenes from the catalog or an NFC tag.', support: 'Support', supportValue: 'Contact the Mini Program owner for support.'
  }
}
