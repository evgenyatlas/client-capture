import booleanIntersects from "@turf/boolean-intersects";
import distance from "@turf/distance";
import { createEvent, createStore } from "effector";
import { throttle } from "patronum/throttle";
import { setPayload } from "../../lib/effectorKit/setPayload";
import { distanceMeters } from "../../lib/geo/distance";

export const setGeolocation = createEvent()
export const setBbox = createEvent()
export const $geolocation = createStore({ coords: [0, 0], accuracy: 0 })
export const $geolocationCoords = $geolocation.map(({ coords }) => coords)
export const $smothCoords = createStore([0, 0])
export const $bbox = createStore([0, 0, 0, 0])

$bbox.on(
    throttle({
        source: $smothCoords,
        timeout: 3000
    }),
    (state, coords) => {

    }
)

$smothCoords.on($geolocation, (currCoords, geo) => distanceMeters(currCoords, geo.coords) >= geo.accuracy ? geo.coords : undefined)
// export const $smot
$geolocation.on(setGeolocation, setPayload)