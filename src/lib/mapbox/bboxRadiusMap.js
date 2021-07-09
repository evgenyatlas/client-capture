import distance from "@turf/distance";
import { point } from "@turf/helpers";
import { bboxMap } from "./bboxMap";
import { centerMap } from "./centerMap";

export function bboxRadiusMap(map) {
    const bbox = bboxMap(map)
    const center = centerMap(map)
    return distance(
        point([bbox[0], center[1]]),
        point([bbox[0], bbox[3]]),
        { units: 'meters' }
    )
}