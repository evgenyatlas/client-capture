import { guard } from "effector";
import mapboxgl, { Map } from "mapbox-gl";
import config from "../../config";
import { delay } from "../../lib/async/delay";
import { createElement } from "../../lib/dom/createElement";
//DEBUG
import { setFpsEv } from "../debug/components/FpsInfo/store";
import { loop } from "./lib/loop";

interface Render {
    render: Function,
    initRender?: Function
}

export class GameRender {
    private map: Map
    private fps: number
    private ctx!: CanvasRenderingContext2D
    private renderers: Render[]
    private lastCall: number
    private canvas!: HTMLCanvasElement
    private launched: boolean
    constructor({ map, renderers = [], fps = 75 }: { map: Map, renderers: Render[], fps: number }) {
        this.map = map
        this.renderers = renderers
        this.fps = fps
        this.lastCall = 0
        this.launched = false

        this.initCanvas()

        this.start()
    }
    private initCanvas() {
        const map = this.map
        const mapCanvas = map.getCanvas()
        const canvas = createElement('canvas', {
            width: mapCanvas.width,
            height: mapCanvas.height,
            class: 'canvas-overlay',
            style: `position: absolute; left: 0px; top: 0px; width: ${mapCanvas.style.width}; height: ${mapCanvas.style.height}`
        })
        const ctx = canvas.getContext('2d')
        //Делаем scale, потому-что размер физических пикселей отличается от логических
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

        map.getCanvasContainer().appendChild(canvas)


        this.ctx = ctx
        this.canvas = canvas
    }

    start() {
        this.map.on('render', this.render)
        loop(this.render, requestAnimationFrame)
        loop(this.render, (fn: Function) => setTimeout(fn, 10))
        this.launched = true
    }

    stop() {
        this.launched = false
        this.map.off('render', this.render)
    }

    private render = () => {
        const canvas = this.canvas
        const ctx = this.ctx
        const map = this.map
        const now = performance.now()
        const deltaCall = now - this.lastCall
        // limit frames
        if (deltaCall > (1000 / config().GAME.FPS)) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            for (let i = 0; i < this.renderers.length; i++) {
                this.renderers[i].render({ ctx, map, canvas })
            }
            setFpsEv(`${(1000 / deltaCall).toFixed(0)} ${config().GAME.FPS}`)
            this.lastCall = now
        }
    }

    addRender(render: Render) {
        this.renderers.push(render)
        if (render.initRender) {
            const canvas = this.canvas
            const ctx = this.ctx
            const map = this.map
            render.initRender({ ctx, map, canvas })
        }
    }

    removeRender(render: Render) {
        const index = this.renderers.findIndex(rend => rend === render)
        this.renderers.splice(index, 1)
    }

}