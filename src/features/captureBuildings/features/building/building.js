import { BUILDING_STATUSES } from "./const"
import length from '@turf/length'
import { $selectedBuilding, selectBuildingEv } from "../../store"
import { defer } from "../../../../lib/async/defer"
import { delay } from "../../../../lib/async/delay"
import { rgb2hex } from "../../../../lib/color/rgb2hex"
import config from "../../../../config"

export class Building {
    static COLOR_SELECTED = '#a7a7a7'
    static PAINT_TIME_SELECTED = 400
    id = 0
    size = 0
    energyFactor = 0
    energyCost = 0
    constDouble = false
    status = BUILDING_STATUSES.FREE
    capturedPlayer = null
    startTimeCapture = 0
    geometry = null
    views = {
        name: '',
        layer: null,
        source: null,
    }
    #map = null

    constructor(id, geometry, map) {

        this.id = id
        this.size = Math.round(length(geometry, { units: 'meters' }))
        this.energyFactor = +(this.size * config().GAME.FACTOR_ENERGY_MULTI).toFixed(1)
        this.energyCost = +(this.size * config().GAME.FACTOR_ENERGY_COST).toFixed(0)
        this.energyCostCaptured = Math.ceil(this.energyCost * 2)
        this.geometry = geometry
        this.#map = map
        // this.initViews()
    }

    async capture({ player, captureTime }) {
        // if (!this.views.source) this.initViews()
        //Если здание захватывается второй раз то умножаем его стоимость на два
        if (this.capturedPlayer && this.energyCost !== this.energyCostCaptured) {
            this.energyCost = this.energyCostCaptured
        }
        this.capturedPlayer = player
        // this.startTimeCapture = captureTime
        // this.#map.setPaintProperty(this.views.name, 'fill-opacity', 0)
        // await delay(Building.PAINT_TIME_SELECTED)
        // this.#map.setPaintProperty(this.views.name, 'fill-opacity-transition', { duration: captureTime })
        // await defer()
        // this.#map.setPaintProperty(this.views.name, 'line-color', player.color)
        await defer()
        // this.#map.setPaintProperty(this.views.name, 'fill-opacity', 1)
    }

    initViews() {
        this.views.name = `building_${this.id}`
        this.#map.addSource(this.views.name, {
            type: 'geojson',
            data: null
        })

        this.#map.addLayer({
            "id": this.views.name,
            "source": this.views.name,
            'type': 'line',
            'paint': {
                'line-color': '#888',
                'line-width': 10
            },
        }, 'waterway-label')
        this.views.source = this.#map.getSource(this.views.name)
        this.views.source.setData(this.geometry)
    }

    getDataServer() {
        return {
            size: this.size,
            geometry: this.geometry,
            id: this.id,
            energyFactor: this.energyFactor,
            energyCost: this.energyCost
        }
    }
}