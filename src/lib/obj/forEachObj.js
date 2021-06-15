module.exports.forEachObj = (obj, fn) =>
    Object.keys(obj).forEach((key, i, arr) => fn(key, obj[key], i, arr))
