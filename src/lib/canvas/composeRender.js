import { lerp } from "../easing/lerp"

export class ComposeRender {
    #steps
    #data
    #easing
    #render
    #timeCurrStep
    #currStep
    #active = false
    get active() {
        return this.#active
    }
    #ctx
    constructor({ steps, render, ctx, data, easing }) {
        this.#steps = steps
        this.#easing = easing
        this.#data = data
        this.#render = render
        this.#ctx = ctx
    }
    start() {
        this.#timeCurrStep = performance.now()
        this.#active = true
        this.#currStep = 0
    }
    stop() {
        this.#active = false
    }
    getT() {
        return (performance.now() - this.#timeCurrStep) / (this.#steps[this.#currStep].duration)
    }
    render(param) {
        if (!this.#active) return

        //Получаем T (для интерполяции)
        let t = this.getT()

        //Переключение на след шаг
        if (t > 1) {
            this.#timeCurrStep = performance.now()
            this.#currStep++
            if (!this.#steps[this.#currStep]) {
                this.stop()
                return
            }
            t = this.getT()
        }

        const prevState = !this.#currStep ? this.#steps[0].state : this.#steps[this.#currStep - 1].state
        const nextState = this.#steps[this.#currStep].state

        this.#render(this.#ctx, this.#easing(prevState, nextState, t), this.#data, param)
    }
}