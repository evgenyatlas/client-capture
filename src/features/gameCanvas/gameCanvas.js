import mapboxgl from "mapbox-gl";
import config from "../../config";
import { delay } from "../../lib/async/delay";
import { createElement } from "../../lib/dom/createElement";
//DEBUG
import { setFps, setFpsEv } from "../debug/components/FpsInfo/store";

export class GameCanvas {
    constructor({ map, renderers = [], fps = 75 }) {
        this.map = map
        this.renderers = renderers
        this.ctx = null
        this.fps = fps
        this.devicePixelRatio = 0
        this.lastCall = 0
        this.canvas = null
        this.launched = false
    }
    init() {

        const map = this.map
        const canvas = createElement('canvas', {
            width: map._canvas.width,
            height: map._canvas.height,
            class: 'canvas-overlay',
            style: `position: absolute; left: 0px; top: 0px; width: ${map._canvas.style.width}; height: ${map._canvas.style.height}`
        })
        map._canvasContainer.appendChild(canvas)

        const ctx = canvas.getContext('2d')
        const devicePixelRatio = canvas.width / parseInt(canvas.style.width)

        this.ctx = ctx
        this.devicePixelRatio = devicePixelRatio
        this.canvas = canvas

        this.launched = true
        this.renderCycle()
        map.on('render', this.render)
    }

    renderCycle = () => {
        if (!this.launched) return

        requestAnimationFrame(this.renderCycle)


        this.render()
        //DEBUG

    }

    render = () => {
        const canvas = this.canvas
        const ctx = this.ctx
        const map = this.map
        const devicePixelRatio = this.devicePixelRatio
        const now = performance.now()
        // limit frames
        const deltaCall = now - this.lastCall
        if (deltaCall > (1000 / config().GAME.FPS)) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            for (let i = 0; i < this.renderers.length; i++) {
                this.renderers[i].render({ ctx, map, devicePixelRatio, canvas })
            }
            setFpsEv(`${(1000 / deltaCall).toFixed(0)} ${config().GAME.FPS}`)
            this.lastCall = now
        }
    }

    addRender(render) {
        this.renderers.push(render)
        if (render.initRender) {
            const canvas = this.canvas
            const ctx = this.ctx
            const map = this.map
            const devicePixelRatio = this.devicePixelRatio
            render.initRender({ ctx, map, devicePixelRatio, canvas })
        }
    }

    removeRender(render) {
        const index = this.renderers.findIndex(rend => rend === render)
        this.renderers.splice(index, 1)
    }

}