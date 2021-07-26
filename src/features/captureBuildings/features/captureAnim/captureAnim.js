import { delay } from "../../../../lib/async/delay"

export class CaptureAnim {
    #duration = 1000
    #views = []
    #map
    #layerStyle
    #emptyFeature = {
        type: 'Feature'
    }
    #layerName = 'capture_anim'
    constructor(map, layerStyle, startCountViews = 2) {
        this.#map = map
        this.#saveLayerStyle(layerStyle)
        this.#addViews(startCountViews)
    }
    #saveLayerStyle = (layerStyle) => {
        this.#layerStyle = {
            ...layerStyle,
            paint: {
                ...layerStyle.paint,
                'fill-opacity': 0,
                'fill-opacity-transition': {
                    'duration': this.#duration
                },
            }
        }
    }
    async anim(feature) {
        //Получаем свободную view (для отрисовки) или создаем новую 
        const view = this.#views.find(view => view.free) || this.#addView()
        //Ставим статус,что она занята
        view.free = false
        //Устанавливаем данные для отрисовки
        view.source.setData(feature)
        this.#map.setPaintProperty(view.name, 'fill-opacity', 1)
        await delay(this.#duration)
        //Сделанно в таком формате, что бы не было мерцания
        //Когда мы ожидаем анимацию и закрашиваем здание
        delay(10).then(() => {
            view.source.setData(this.#emptyFeature)
            this.#map.setPaintProperty(view.name, 'fill-opacity', 0)
            view.free = true
        })

    }
    #addViews = count => {
        for (let i = 0; i < count; i++) {
            this.#addView()
        }
    }
    #addView = () => {
        const name = this.#layerName + this.#views.length
        this.#map.addSource(name, {
            type: 'geojson',
            data: null
        })
        this.#layerStyle.id = name
        this.#layerStyle.source = name
        this.#map.addLayer(
            this.#layerStyle,
            'country-label'
        )
        const view = { source: this.#map.getSource(name), free: true, name }
        this.#views.push(view)
        return view
    }
}