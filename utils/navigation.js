function openModel(sceneId) {
  if (sceneId) wx.navigateTo({ url: `/pages/model/model?sceneId=${encodeURIComponent(sceneId)}` })
}

function openSettings() { wx.navigateTo({ url: '/pages/settings/settings' }) }
function openDescription(sceneId) {
  if (sceneId) wx.navigateTo({ url: `/pages/description/description?sceneId=${encodeURIComponent(sceneId)}` })
}
function goHome() { wx.switchTab({ url: '/pages/index/index' }) }

module.exports = { openModel, openDescription, openSettings, goHome }
