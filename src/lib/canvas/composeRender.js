import { lerp } from "../easing/lerp"

/**
 * Класс для создания пошаговых анимаций
 */
export class ComposeRender {
    #ctx
    #steps
    #data
    #easing
    #render
    #timeCurrStep
    #currStep
    #onDone
    #active = false
    get active() {
        return this.#active
    }
    constructor({ steps, render, ctx, data, easing, onDone }) {
        this.#steps = steps
        this.#easing = easing
        this.#data = data
        this.#render = render
        this.#ctx = ctx
        this.#onDone = onDone
    }
    start(data) {
        this.#timeCurrStep = performance.now()
        this.#active = true
        this.#currStep = 0
        if (data)
            this.#data = data
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
        if (t >= 1) {
            this.#timeCurrStep = performance.now()
            this.#currStep++
            //Если шаг последний
            if (!this.#steps[this.#currStep]) {
                t = 1
                this.#currStep--
                this.stop()
                this.#onDone && this.#onDone()
            } else {
                t = this.getT()
            }
        }

        const prevState = !this.#currStep ? this.#steps[0].state : this.#steps[this.#currStep - 1].state
        const nextState = this.#steps[this.#currStep].state

        this.#render(this.#ctx, this.#easing(prevState, nextState, t), this.#data, param)
    }
}