import { $gameMap, changeGameMap } from "./store";
import { flyTo } from "./lib/flyTo";
import { mapFollowGeo } from "./lib/mapFollowGeo";
import { viewportMapBbox } from "../../lib/mapbox/viewportMapBbox";
import transformScale from "@turf/transform-scale";

export function initGameMap() {

    //обьяснить антону про утечку памяти
    $gameMap.watch((map) => {
        if (!map) return
        //Следование карты за геопозицией
        mapFollowGeo(map)
    })

}