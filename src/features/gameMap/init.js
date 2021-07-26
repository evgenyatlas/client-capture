import { $gameMap, changeGameMap } from "./store";
import { flyTo } from "./lib/flyTo";
import { mapFollowGeo } from "./lib/mapFollowGeo";
import { viewportMapBbox } from "../../lib/mapbox/viewportMapBbox";
import transformScale from "@turf/transform-scale";
import { onDoneRenderMap } from "../../lib/mapbox/onDoneRenderMap";

export function initGameMap() {
    return new Promise((res) => {
        $gameMap.watch((map) => {
            if (!map) return
            //Следование карты за геопозицией
            mapFollowGeo(map)
            //Следим когда карта отрендирина
            onDoneRenderMap(map, res)
        })
    })
}