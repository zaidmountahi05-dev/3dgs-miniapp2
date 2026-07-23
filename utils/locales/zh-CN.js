module.exports = {
  appName: 'NFC 3D 模型浏览器',
  tabs: { home: '浏览', history: '历史', favorites: '收藏' },
  common: { yes: '是', no: '否', cancel: '取消', confirm: '确认', retry: '重试', clear: '清空', delete: '删除' },
  errors: { missingSceneId: '缺少场景 ID', missingNfcId: '缺少 NFC ID', modelNotFound: '未找到模型', nfcModelNotFound: '此 NFC 标签未关联模型', invalidResponse: '服务器返回了无效响应', apiError: '服务器错误（{details}）' },
  home: {
    recentCount: '最近查看：{count}', favoriteCount: '收藏：{count}', allCount: '全部模型：{count}', settings: '设置',
    nfcStatus: 'NFC 状态', deviceSupported: '设备支持：', scanning: '扫描中：', search: '搜索模型名称、描述或标签',
    allModels: '全部模型', recent: '最近查看', favorites: '收藏的模型', noMatches: '没有匹配的模型', noModels: '暂无可用模型',
    tryKeywords: '请尝试其他关键词', addCatalog: '请先在 data/catalog.js 中添加模型', noRecent: '暂无最近查看的模型', recentHint: '从目录或 NFC 标签打开模型',
    noFavorites: '暂无收藏模型', favoriteHint: '打开模型后点击收藏', scan: '开始 NFC 扫描', nfcUnsupported: '当前设备不支持 NFC 扫描',
    wechatOld: '微信版本过低', approachTag: '请将手机靠近 NFC 标签', nfcStartFailed: 'NFC 启动失败', systemInfoFailed: '系统信息获取失败',
    invalidTag: '无法识别 NFC 标签', readFailed: '标签读取失败',
    viewDescription: '查看详情', addFavorite: '添加收藏', removeFavorite: '取消收藏', removeHistory: '从历史中删除', removedHistory: '已从历史中删除', actions: '模型操作'
  },
  history: { title: '浏览历史', count: '共 {count} 个模型', empty: '暂无浏览记录', hint: '打开过的模型会显示在这里', explore: '浏览模型', lastViewed: '最后查看：{value}', clearTitle: '清空历史？', clearMessage: '这将删除此设备上的全部浏览历史。', cleared: '历史已清空' },
  favorites: { title: '我的收藏', count: '共 {count} 个模型', empty: '暂无收藏模型', hint: '打开模型后点击收藏', explore: '浏览模型', type: '类型：{value}', removeTitle: '取消收藏？', removeMessage: '确定取消收藏“{name}”吗？', removed: '已取消收藏' },
  model: { loading: '模型加载中…', preparing: '正在准备 3D 视图', failed: '模型加载失败', favorite: '收藏', favorited: '已收藏', added: '已收藏', removed: '已取消收藏', ready: '3D 视图已加载', renderFailed: '渲染失败', type: '类型：{value}', format: '格式：{value}', sceneId: '场景 ID：{value}', description: '说明：{value}', missingId: '缺少场景 ID', shareTitle: '3D 模型', openViewer: '打开 3D 查看器', detailsTitle: '模型详情', tags: '标签' },
  settings: {
    title: '设置', profile: '个人资料', nickname: '昵称', changeNickname: '修改昵称', chooseAvatar: '选择头像', language: '语言', languageHint: '选择小程序和 3D 查看器使用的语言', english: 'English', chinese: '简体中文',
    viewer: '查看器偏好', autoRotate: '默认自动旋转', reducedMotion: '减少动态效果', showControls: '显示查看器控件', quality: '渲染质量', qualityAuto: '自动', qualityPerformance: '性能优先', qualityHigh: '高画质',
    storage: '存储与隐私', localOnly: '个人资料、语言、历史、收藏和查看器偏好仅保存在此设备。', clearHistory: '清空历史', clearFavorites: '清空收藏', resetAll: '重置全部本地数据', clearFavoritesTitle: '清空收藏？', clearFavoritesMessage: '这将删除此设备上的全部收藏。', resetTitle: '重置全部数据？', resetMessage: '这将删除此设备上的个人资料、语言、历史、收藏和查看器偏好。', done: '操作完成',
    about: '小程序信息', version: '版本', formats: '支持格式', technology: '查看器技术', appDescription: '通过模型目录或 NFC 标签打开可交互的高斯泼溅和点云场景。', support: '支持', supportValue: '如需帮助，请联系小程序所有者。'
  }
}
