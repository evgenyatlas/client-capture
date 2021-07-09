import length from '@turf/length'
import config from "../../../../config"
import { getFeatureId } from "../../../../lib/mapbox/getFeatureId"

export class Building {
    static COLOR_SELECTED = '#a7a7a7'
    static PAINT_TIME_SELECTED = 400
    id = 0
    size = 0
    energyFactor = 0
    energyCost = 0
    constDouble = false
    capturedPlayer
    startTimeCapture = 0
    feature

    constructor(building) {

        this.id = building.id || getFeatureId(building.feature)
        this.size = building.size || Math.round(length(building.feature.geometry, { units: 'meters' }))
        this.energyFactor = building.energyFactor || +(this.size * config().GAME.FACTOR_ENERGY_MULTI).toFixed(1)
        this.energyCost = building.energyCost || +(this.size * config().GAME.FACTOR_ENERGY_COST).toFixed(0)
        this.energyCostCaptured = building.energyCostCaptured || Math.ceil(this.energyCost * 2)
        this.feature = building.feature
        this.feature.properties.id = this.id
        // this.initViews()
    }

    capture(player) {
        //Если здание захватывается второй раз то умножаем его стоимость на два
        if (this.capturedPlayer && this.energyCost !== this.energyCostCaptured) {
            this.energyCost = this.energyCostCaptured
        }
        this.feature.properties.color = player.color
        this.capturedPlayer = player
    }

    getDataServer() {
        const { capturedPlayer, ...buiding } = this
        return buiding
    }

    static getCleanFeature(feature) {
        return {
            type: 'Feature',
            properties: {

            },
            geometry: feature.geometry
        }
    }
}