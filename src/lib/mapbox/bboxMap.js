export function bboxMap(map) {
    const bounds = map.getBounds()
    return [bounds._sw.lng, bounds._sw.lat, bounds._ne.lng, bounds._ne.lat]
}