export function bounds2bbox(bounds) {
    return [bounds._sw.lng, bounds._sw.lat, bounds._ne.lng, bounds._ne.lat]
}