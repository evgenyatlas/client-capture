import { geometry } from "@turf/turf"
import { delay } from "../../lib/async/delay"
import { getFeatureId } from "../../lib/mapbox/getFeatureId"
import { Building } from './features/building/building'
import { captureBuildingEv, hideBuildingInfo, selectBuildingEv } from "./store"
import { SelectedBuilding } from './features/selectedBuilding/selectBuilding'

export class CaptureBuildings {
    static MIN_CAPTURE_DISTANCE = 50
    static CAPTURE_TIME = 4000

    #map = null
    #user = null
    #players
    #buildings = {}
    #selectedBuilding = null
    #gameCanvas
    #viewSource
    #nameSource = 'captureBuilding'

    constructor({ map, gameCanvas }) {
        this.#map = map
        this.#gameCanvas = gameCanvas
    }

    init({ buildings, user, players }) {

        this.#user = user
        this.#players = players
        this.#selectedBuilding = new SelectedBuilding(this.#map)
        /*Обработка событий*/
        //Фокус на строение (выбор)
        this.onSelectBuilding()
        //Отмена фокуса на строение
        this.onUnSelectBuilding()
        //захват строений
        this.onCaptureBuilding()

        this.initView()
    }

    initView() {
        this.#map.addSource(this.#nameSource, {
            type: 'geojson',
            data: null
        })
        this.#map.addLayer({
            "id": this.#nameSource,
            "source": this.#nameSource,
            'type': 'line',
            'paint': {
                'line-color': ['get', 'color'],
                'line-width': 10
            },
        }, 'waterway-label')
        this.#viewSource = this.#map.getSource(this.#nameSource)
    }

    //Обработка захвата строений
    onCaptureBuilding() {
        const features = []
        captureBuildingEv.watch(async ({ player, building }) => {
            //Снимаем фокус с строения (если он на нем)
            this.unSelectBuilding()
            const captureBuilding = this.getBuilding(building.id, building.geometry)
            //Если строение уже захваченно нашим пользователем, то вызываем метод (который отнимет множитель энерегии и тд)
            if (captureBuilding.capturedPlayer === this.#user.player) this.#user.unCaptureBuilding(captureBuilding)
            //Вызываем у строения метод захвата
            captureBuilding.capture({ player, captureTime: CaptureBuildings.CAPTURE_TIME })
            features.push({
                type: 'Feature', geometry: building.geometry, properties: {
                    color: player.color
                }
            })
            this.#viewSource.setData({
                type: 'FeatureCollection',
                features: features
            })
        })
    }

    //Подписка на обработку выбора зданий (фокус)
    onSelectBuilding = () => {
        this.#map.on('click', 'building', (e) => {
            const feature = e.features[0]
            const buildingId = getFeatureId(feature)

            const building = this.getBuilding(buildingId, feature.geometry)
            this.#selectedBuilding.select(building)



            // this.#gameCanvas.addRender({
            //     render({ ctx, factorPixel, map }) {
            //         ctx.beginPath()
            //         feature.geometry.coordinates[0].forEach((coord, i) => {
            //             const pos = map.project(coord)
            //             if (i === 0) {
            //                 ctx.moveTo(pos.x * factorPixel, pos.y * factorPixel);
            //                 return
            //             }
            //             ctx.lineTo(pos.x * factorPixel, pos.y * factorPixel);
            //             // console.timeEnd()
            //             // ctx.fillStyle = 'black'
            //             // ctx.fill();
            //             ctx.strokeStyle = "#969696";
            //             ctx.lineWidth = 15
            //             ctx.stroke()
            //         })
            //     }
            // })
        })
    }

    //Подписка на отмена фокуса на строение
    onUnSelectBuilding() {
        hideBuildingInfo.watch(this.unSelectBuilding)
    }

    unSelectBuilding = () => {
        this.#selectedBuilding.unselect()
    }

    getBuilding(buildingId, geometry) {
        if (!this.#buildings[buildingId])
            this.#buildings[buildingId] = new Building(buildingId, geometry, this.#map)
        console.log(Object.keys(this.#buildings).length)
        return this.#buildings[buildingId]
    }

}