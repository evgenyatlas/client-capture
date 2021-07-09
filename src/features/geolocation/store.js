import booleanIntersects from "@turf/boolean-intersects";
import distance from "@turf/distance";
import { debounce } from "@vkontakte/vkjs";
import { createEvent, createStore } from "effector";
import createSwitchStore from "../../lib/effectorKit/createSwitchStore";
import { setPayload } from "../../lib/effectorKit/setPayload";
import { distanceMeters } from "../../lib/geo/distance";

export const setGeolocation = createEvent()

export const $geolocation = createStore({ coords: [0, 0], accuracy: 0 })
export const $geolocationCoords = $geolocation.map(({ coords }) => coords)
export const $smothCoords = createStore([0, 0])

const { $store: $frozen, on: freezeGeolocation, off: unFreezeGeolocation } = createSwitchStore(false)
export { freezeGeolocation, unFreezeGeolocation }

$geolocation.on(setGeolocation, setPayload)

$smothCoords.on($geolocation, (currCoords, geo) => !$frozen.getState() && distanceMeters(currCoords, geo.coords) >= geo.accuracy ? geo.coords : undefined)