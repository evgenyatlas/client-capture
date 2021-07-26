import { defer } from "../../../../lib/async/defer"
import { selectBuildingEv } from "../../store"

export class SelectedBuilding {
    #nameSource = 'selectedBuilding'
    #color = '#a7a7a7'
    #viewSource
    #map
    constructor(map) {
        this.#map = map
        this.initView()
    }
    async select(building) {
        selectBuildingEv(building)
        this.#viewSource.setData(building.feature.geometry)
        await defer()
        this.#map.setPaintProperty(this.#nameSource, 'fill-opacity', 1)
    }
    async unselect() {
        this.#map.setPaintProperty(this.#nameSource, 'fill-opacity', 0)
    }
    initView() {
        this.#map.addSource(this.#nameSource, {
            type: 'geojson',
            data: null
        })
        this.#map.addLayer({
            "id": this.#nameSource,
            "source": this.#nameSource,
            'type': 'fill',
            'paint': {
                'fill-color': this.#color,
                'fill-opacity': 0,
            },
        }, 'country-label')
        this.#viewSource = this.#map.getSource(this.#nameSource)
    }
}