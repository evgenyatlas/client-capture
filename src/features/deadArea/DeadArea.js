
export class DeadArea {
    #map = null
    #view = {
        layer: null,
        source: null,
        name: 'deadArea'
    }
    #polygon = null

    constructor(map) {
        this.#map = map
        this.initView()
    }
    render({ ctx = new CanvasRenderingContext2D, map, factorPixel }) {
        return
        if (!this.#polygon) return
        ctx.beginPath();
        // console.time()
        this.#polygon.map((coords, i) => {
            const pos = map.project(coords)
            if (i === 0) {
                ctx.moveTo(pos.x * factorPixel, pos.y * factorPixel);
                return
            }
            ctx.lineTo(pos.x * factorPixel, pos.y * factorPixel);
        })
        // console.timeEnd()
        // ctx.fillStyle = 'black'
        // ctx.fill();
        ctx.strokeStyle = "#969696";
        ctx.lineWidth = 15
        ctx.stroke()
    }
    initView() {
        this.#map.addSource(this.#view.name, {
            type: 'geojson',
            data: null
        })

        this.#map.addLayer({
            "id": this.#view.name,
            "source": this.#view.name,
            'type': 'line',
            'layout': {},
            'paint': {
                'line-color': '#969696',
                'line-width': 5
            }
        }, 'poi-label')

        this.#view.source = this.#map.getSource(this.#view.name)
    }
    update(geojson) {
        this.#polygon = geojson.geometry.coordinates[0]
        this.#view.source.setData(geojson)
    }

}