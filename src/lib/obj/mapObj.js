export const mapObj = (obj, fn) => {
    return Object.keys(obj).reduce((newObj, keyObj) => {
        newObj[keyObj] = fn(obj[keyObj])
        return newObj
    }, {})
}