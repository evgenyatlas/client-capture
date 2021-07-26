export class RenderBuildings {
    #renderList = []
    #renderDictionray = {}
    #layerStyle
    #source
    #map
    constructor(map, layerStyle) {
        this.#map = map
        this.#layerStyle = layerStyle
        this.initViews()
    }

    //Метод для добавления здания в render
    add(building) {
        //Если здание уже есть в рендер листе, то удаляем его
        if (this.#renderDictionray[building.id]) {
            const index = this.#renderList.findIndex(feature => feature.properties.id === building.id)
            index !== -1
                &&
                this.#renderList.splice(index, 1)
                &&
                this.#source.setData({
                    type: 'FeatureCollection',
                    features: this.#renderList
                })
        }
        this.#renderList.push(building.feature)
        this.#renderDictionray[building.id] = true
    }

    render() {
        this.#source.setData({
            type: 'FeatureCollection',
            features: this.#renderList
        })
    }

    clear() {
        this.#renderDictionray = {}
        this.#renderList = []
    }

    load(buildings) {
        this.#renderDictionray = {}
        this.#renderList = []
    }

    initViews() {
        const nameCapture = this.#layerStyle.id

        this.#map.addSource(nameCapture, {
            type: 'geojson',
            data: null
        })
        this.#map.addLayer(this.#layerStyle, 'country-label')

        this.#source = this.#map.getSource(nameCapture)
    }

}