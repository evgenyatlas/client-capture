import config from "../../../config"

export function flyTo(map, coords) {
    map.flyTo({
        center: coords,
        duration: 1000,
        zoom: config().DEFAULT_ZOOM
    })
}