import { centerMap } from "../../../lib/mapbox/centerMap"
import destination from "@turf/destination"

export function calcDistanceAttackPixel(attackDistanceMeters, avatarSize, map, devicePixelRatio) {
    return (Math.abs(
        map.project(centerMap(map)).y
        -
        map.project(destination(centerMap(map), attackDistanceMeters, 0, { units: 'meters' }).geometry.coordinates).y
    ) * devicePixelRatio) - avatarSize / 2
}
