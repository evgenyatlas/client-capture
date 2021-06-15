const FIXED = 6

export const roundGeoArr = (geo) => {
    geo[0] = +geo[0].toFixed(FIXED)
    geo[1] = +geo[1].toFixed(FIXED)
    return geo
}

export const roundGeoObj = (geo) => {
    return roundGeoArr([geo.lng, geo.lat])
}