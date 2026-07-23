// utils/version.js

function compareVersion(v1 = '', v2 = '') {
  const arr1 = String(v1).split('.').map(n => parseInt(n, 10) || 0)
  const arr2 = String(v2).split('.').map(n => parseInt(n, 10) || 0)
  const length = Math.max(arr1.length, arr2.length)

  for (let i = 0; i < length; i += 1) {
    const num1 = arr1[i] || 0
    const num2 = arr2[i] || 0

    if (num1 > num2) return 1
    if (num1 < num2) return -1
  }

  return 0
}

module.exports = {
  compareVersion
}