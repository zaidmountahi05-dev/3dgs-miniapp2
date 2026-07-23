const EMPTY_PAYLOAD = Object.freeze({ sceneId: '', nfcId: '' })

function normalizePayload(payload = {}) {
  return {
    sceneId: payload.sceneId ? String(payload.sceneId).trim() : '',
    nfcId: payload.nfcId ? String(payload.nfcId).trim().toUpperCase() : ''
  }
}

function arrayBufferToString(buffer) {
  try {
    const bytes = new Uint8Array(buffer)
    let encoded = ''
    bytes.forEach(byte => { encoded += `%${byte.toString(16).padStart(2, '0')}` })
    return decodeURIComponent(encoded)
  } catch (error) {
    return ''
  }
}

function parseNFCData(response) {
  if (!response) return { ...EMPTY_PAYLOAD }
  if (response.sceneId || response.nfcId) return normalizePayload(response)
  if (!response.message) return { ...EMPTY_PAYLOAD }

  const text = arrayBufferToString(response.message).trim()
  if (!text) return { ...EMPTY_PAYLOAD }

  try {
    if (text.startsWith('{')) return normalizePayload(JSON.parse(text))
  } catch (error) {
    console.warn('NFC JSON payload could not be parsed:', error)
    return { ...EMPTY_PAYLOAD }
  }

  return { sceneId: '', nfcId: text.toUpperCase() }
}

module.exports = { parseNFCData, arrayBufferToString }
