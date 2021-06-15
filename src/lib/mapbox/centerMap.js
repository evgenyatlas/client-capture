export function centerMap(map) {
    const center = map.getCenter()
    return [center.lng, center.lat]
}