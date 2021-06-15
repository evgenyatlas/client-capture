import distance from '@turf/distance'

const config = {
    units: 'meters'
}

export function distanceMeters(a, b) {
    return distance(a, b, config)
}