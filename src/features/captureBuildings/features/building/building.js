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

    constructor(id, geometry, map) {

        this.id = id
        this.size = Math.round(length(geometry, { units: 'meters' }))
        this.energyFactor = +(this.size * config().GAME.FACTOR_ENERGY_MULTI).toFixed(1)
        this.energyCost = +(this.size * config().GAME.FACTOR_ENERGY_COST).toFixed(0)
        this.energyCostCaptured = Math.ceil(this.energyCost * 2)
        this.geometry = geometry
        // this.initViews()
    }

    capture(player) {
        //Если здание захватывается второй раз то умножаем его стоимость на два
        if (this.capturedPlayer && this.energyCost !== this.energyCostCaptured) {
            this.energyCost = this.energyCostCaptured
        }
        this.capturedPlayer = player
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