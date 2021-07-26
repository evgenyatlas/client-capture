import { lerp } from "../easing/lerp"

export class EasingValue {

    #prevValue
    #currValue
    #nextValue
    #getter
    #easing
    get easing() {
        return this.#easing
    }
    #duration
    get duration() {
        return this.#duration
    }
    get active() {
        return this.#active
    }
    #active = false
    #delay
    #timeLastChange
    #endFn
    #backwards

    constructor({
        value,
        nextValue,
        getter,
        delay = 0,
        duration = 1000,
        easing = lerp,
        backwards,
        endFn,
        restore
    }) {
        this.#prevValue = value
        this.#currValue = value
        this.#nextValue = nextValue !== undefined ? nextValue : value
        this.#backwards = backwards
        this.#getter = getter
        this.#endFn = endFn

        this.#easing = easing
        this.#duration = duration
        this.#delay = delay

        this.#timeLastChange = performance.now() + this.#delay

        //Метод что бы восстановить дефолтные настройки
        if (restore)
            this.restore = () => {
                this.#delay = delay
                this.#easing = easing
                this.#duration = duration
            }
    }
    // set(value) {
    //     this.#prevValue = this.#currValue
    //     this.#nextValue = value
    //     this.#timeLastChange = performance.now() + this.#delay
    //     this.active = true
    // }
    getT() {
        const now = performance.now()
        const t = (this.#delay && performance.now() < this.#timeLastChange)
            ?
            0
            :
            ((now - this.#timeLastChange) / this.#duration)

        if (t > 1)
            this.#active = false

        return t
    }
    get() {
        const t = this.getT()
        // t = t >= 1 ? 1 : t

        if (t >= 1) {
            if (this.#endFn) {
                this.#endFn()
            }
            if (this.#backwards !== undefined) {
                this.#nextValue = this.#backwards
                this.#currValue = this.#backwards
                this.#prevValue = this.#backwards
            }
            return this.#nextValue
        }

        if (this.#getter)
            return this.#currValue = this.#getter(this.#prevValue, this.#nextValue, t, this.#easing)

        return this.#currValue = this.#easing(this.#prevValue, this.#nextValue, t)
    }
    set(value) {
        this.#prevValue = this.#currValue
        this.#nextValue = value
        this.#timeLastChange = performance.now() + this.#delay

        this.#active = true
    }
    setDuration(duration) {
        this.#duration = duration
    }
    setEasing(easing) {
        this.#easing = easing
    }
}