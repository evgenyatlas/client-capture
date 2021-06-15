import { debounce } from "@vkontakte/vkjs"
import config from "../../../config"
import { roundGeoObj } from "../../../lib/geo/roundGeo"
import { $smothCoords, setBbox } from "../../geolocation/store"
import { flyTo } from "./flyTo"

export function mapFollowGeo(map) {

    $smothCoords.watch((geoCoords) => flyTo(map, geoCoords))

    //Сделано для того, что бы при интерактиве пользователя с картой, следование не застревало
    map.on(
        'moveend',
        debounce(() => {
            const geoCoords = $smothCoords.getState()
            const cameraCoords = roundGeoObj(map.getCenter())
            if (cameraCoords[0] !== geoCoords[0] || cameraCoords[1] !== geoCoords[1]) {
                flyTo(map, geoCoords)
            }
        }, 700)
    )
}