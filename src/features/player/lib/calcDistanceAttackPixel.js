import { centerMap } from "../../../lib/mapbox/centerMap"
import destination from "@turf/destination"

export function calcDistanceAttackPixel(attackDistanceMeters, avatarSize, map) {
    return (Math.abs(
        map.project(centerMap(map)).y
        -
        map.project(destination(centerMap(map), attackDistanceMeters, 0, { units: 'meters' }).geometry.coordinates).y
    )) - avatarSize / 2
}
