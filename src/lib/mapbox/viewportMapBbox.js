import distance from "@turf/distance"
import { point } from "@turf/helpers"
import { square } from "../geo/square"
import { bboxMap } from "./bboxMap"
import { centerMap } from "./centerMap"

//Возвращает видимую область (с учетом rotate вокруг центра)
export function viewportMapBbox(map) {
    const bbox = bboxMap(map)
    const center = centerMap(map)
    return square(
        center,
        distance(
            point(center),
            point([bbox[0], bbox[3]]),
            {
                units: 'meters'
            }
        )
    )
}
