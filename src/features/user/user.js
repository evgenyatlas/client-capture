import { attackEv } from "../user/features/attackBtn/store";
import { $smothCoords } from "../geolocation/store";
import { captureBuildingUserEv, setUserEv, updateEnergyEv, updateEnergyFactorEv } from "./store";
import { viewportMapBbox } from "../../lib/mapbox/viewportMapBbox";
import transformScale from "@turf/transform-scale";
import booleanContains from "@turf/boolean-contains";
import { throttle } from "@vkontakte/vkjs";


export class User {
    id = ''
    player = null
    #socket = null
    #bboxLoaded = null
    #map
    constructor({ player, socket, map }) {
        this.player = player
        this.#map = map
        this.#socket = socket
        this.id = player.id
        //Закидываем нашего игрока в store (по большей части для UI)
        setUserEv({ player: this.player, socket })
        //Прослушивания GPS и смена позиции нашего игрока
        $smothCoords.watch(this.#changePosition)
        //Реакция на события (из UI) захвата строения
        captureBuildingUserEv.watch(this.#captureBuilding)
        //Реакция на события (из UI) атаки
        attackEv.watch(this.#attack)
        this.onChangeBboxLoaded()
    }

    onChangeBboxLoaded() {
        this.#map.addSource('test', {
            "type": "geojson",
            "data": null
        })
        this.#map.addLayer({
            id: 'points-of-interest',
            source: 'test',
            type: 'line',
            'paint': {
                'line-color': 'red',
                'line-width': 10
            },
        })
        const bbboxLoaded = (bbox) => transformScale(bbox, 1.2)
        const bbox = viewportMapBbox(this.#map)
        this.#bboxLoaded = bbboxLoaded(bbox)

        const source = this.#map.getSource('test')

        this.#map.on(
            'moveend',
            throttle(async () => {
                console.time()
                const bbox = viewportMapBbox(this.#map)

                if (!booleanContains(this.#bboxLoaded, bbox)) {
                    console.time()
                    this.#bboxLoaded = bbboxLoaded(bbox)

                }
                source.setData({
                    type: 'FeatureCollection',
                    features: [bbox, this.#bboxLoaded]
                })
                console.timeEnd()
            }, 1000)
        )
    }

    //Метод обновления energy для UI
    updateEnergy = (energy) => {
        updateEnergyEv(energy)
    }
    //Смена позиции 
    #changePosition = (pos) => {
        this.player.changePosition(pos)
        this.#socket.emit('changePosition', pos)
    }
    //Захват строения (вызывается как реакция на события из UI)
    #captureBuilding = (data) => {
        const energyCost = data.building.energyCost
        this.updateEnergy(-energyCost)
        this.player.updateEnergy(-energyCost)
        this.#socket.emit('captureBuilding', data.building.getDataServer())
    }
    unCaptureBuilding = captureBuilding => {
        updateEnergyFactorEv(-captureBuilding.energyFactor)
    }
    //Атака
    #attack = (energy = 1) => {
        //Вызываем метод атаки нашего игрока
        this.player.attack(energy)
        //Обновляем UI
        this.updateEnergy(-energy)
        //Оповещаем сервер
        this.#socket.emit('attack', energy)
    }
}