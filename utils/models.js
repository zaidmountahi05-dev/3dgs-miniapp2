// utils/models.js — thin re-export of the model catalog.
//
// The real catalog now lives in data/catalog.js so it is easier to find and
// replace. Existing imports throughout the app continue to work.

module.exports = require('../data/catalog.js')
