import { getFeatureId } from "../../lib/mapbox/getFeatureId"
import { Building } from './features/building/building'
import { captureBuildingEv, hideBuildingInfo, selectBuildingEv } from "./store"
import { SelectedBuilding } from './features/selectedBuilding/selectBuilding'
import { CaptureAnim } from "./features/captureAnim/captureAnim"
import { RenderBuildings } from "./features/renderBuildings/renderBuildings"

export class CaptureBuildings {
    static MIN_CAPTURE_DISTANCE = 50
    static CAPTURE_TIME = 4000
    #layerStyle = {
        "id": 'capture',
        "source": 'capture',
        'type': 'fill',
        'paint': {
            'fill-color': ['get', 'color'],
            // 'fill-width': 10,
        }
    }
    #map = null
    #user = null
    #players
    #buildings = {}
    #selectedBuilding = null
    #captureAnim
    #renderBuildings

    constructor({ map, players }) {
        this.#map = map
        this.#players = players
        this.#renderBuildings = new RenderBuildings(map, this.#layerStyle)
    }

    init({ buildings, user }) {
        this.#user = user
        this.#selectedBuilding = new SelectedBuilding(this.#map)
        this.#captureAnim = new CaptureAnim(this.#map, this.#layerStyle)
        /*Обработка событий*/
        //Фокус на строение (выбор)
        this.onSelectBuilding()
        //Отмена фокуса на строение
        this.onUnSelectBuilding()
        //захват строений
        this.onCaptureBuilding()
        //Прогрузка строений
        this.#user.socket.on('loadingBuildings', this.#handlerLoadingBuildings)
        //Если здания переданы, то прогружаем их
        if (buildings.length > 0)
            this.load(buildings)
    }

    #handlerLoadingBuildings = (buildings) => {
        this.load(buildings)
    }

    //Обработка захвата строений
    onCaptureBuilding() {
        captureBuildingEv.watch(async ({ player, building }) => {
            //Снимаем фокус с строения (если он на нем)
            this.unSelectBuilding()
            const captureBuilding = this.getBuilding(building)
            //Если строение уже захваченно нашим пользователем, то вызываем метод (который отнимет множитель энерегии и тд)
            if (captureBuilding.capturedPlayer === this.#user.player) this.#user.unCaptureBuilding(captureBuilding)
            //Вызываем у строения метод захвата
            captureBuilding.capture(player)
            //Добавляем здание в рендер
            this.#renderBuildings.add(captureBuilding)
            //Вызываем анимацию захвата и ждем
            await this.#captureAnim.anim(captureBuilding.feature)
            //Отрисовываем здания
            this.#renderBuildings.render()
        })
    }

    //Подписка на обработку выбора зданий (фокус)
    onSelectBuilding = () => {
        this.#map.on('click', 'building', (e) => {
            const feature = e.features[0]
            const buildingId = getFeatureId(feature)
            const building = this.getBuilding({
                id: buildingId,
                feature: Building.getCleanFeature(feature)
            })
            this.#selectedBuilding.select(building)
        })
    }

    //Подписка на отмена фокуса на строение
    onUnSelectBuilding() {
        hideBuildingInfo.watch(this.unSelectBuilding)
    }

    unSelectBuilding = () => {
        this.#selectedBuilding.unselect()
    }

    //Прогрузка зданий
    load(buildings) {
        //Очищаем рендеринг
        this.#renderBuildings.clear()
        //Очищаем здания в словаре
        this.#buildings = {}
        //Добавляем каждое здание в словарь и рендиринг
        for (let i = 0; i < buildings.length; i++) {
            const building = this.getBuilding(buildings[i])
            const capturedPlayer = this.#players[buildings[i].capturedPlayer]
            if (capturedPlayer) building.capture(capturedPlayer)
            this.#renderBuildings.add(building)
        }
        this.#renderBuildings.render()
    }

    getBuilding(building) {
        if (!this.#buildings[building.id])
            this.#buildings[building.id] = new Building(building)

        return this.#buildings[building.id]
    }

}