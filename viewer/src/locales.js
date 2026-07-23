const dictionaries = {
  en: {
    loading: 'Loading…',
    creating: 'Creating WebGL renderer…',
    loadingScene: 'Downloading and processing Gaussian scene',
    ready: 'Ready. Drag to orbit, pinch to zoom, and use two fingers to pan.',
    failed: 'Failed to initialize',
    front: 'Front',
    left: 'Left',
    right: 'Right',
    top: 'Top',
    reset: 'Reset',
    autoRotate: 'Auto rotate',
    orbit: 'Orbit path',
    on: 'On',
    off: 'Off',
    hide: 'Hide controls',
    show: 'Show controls',
    distance: 'Distance',
    switched: 'Switched to {name} view',
    help: 'Help',
    fullscreen: 'Full screen',
    exitFullscreen: 'Exit full screen',
    immersiveOn: 'Immersive view enabled',
    immersiveOff: 'Immersive view closed',
    helpTitle: 'Viewer controls',
    helpCopy: 'Drag to rotate · Pinch to zoom · Two-finger drag to pan · Use Reset to restore the camera'
  },
  'zh-CN': {
    loading: '加载中…',
    creating: '正在创建 WebGL 渲染器…',
    loadingScene: '正在下载并处理高斯场景',
    ready: '加载完成。拖动旋转，双指缩放或平移。',
    failed: '初始化失败',
    front: '正面',
    left: '左侧',
    right: '右侧',
    top: '顶部',
    reset: '重置',
    autoRotate: '自动旋转',
    orbit: '环绕路径',
    on: '开启',
    off: '关闭',
    hide: '隐藏控件',
    show: '显示控件',
    distance: '距离',
    switched: '已切换到{name}视图',
    help: '帮助',
    fullscreen: '全屏',
    exitFullscreen: '退出全屏',
    immersiveOn: '已进入沉浸视图',
    immersiveOff: '已退出沉浸视图',
    helpTitle: '查看器操作',
    helpCopy: '拖动旋转 · 双指缩放 · 双指拖动平移 · 使用重置恢复相机'
  }
}

export function createTranslator(language) {
  const dictionary = dictionaries[language] || dictionaries.en
  return (key, variables = {}) => {
    const template = dictionary[key] || dictionaries.en[key] || key
    return template.replace(/\{(\w+)\}/g, (_, name) => variables[name] || '')
  }
}
