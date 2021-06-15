import { lerp } from "../easing/lerp"

const getValue = v => v

export class EasingValue {

    #prevValue
    #currValue
    #nextValue
    #getter
    #easing
    #duration
    #timeLastChange
    #endFn
    #backwards

    constructor({
        value,
        nextValue,
        getter,
        duration = 1000,
        easing = lerp,
        backwards,
        endFn
    }) {
        this.#prevValue = value
        this.#currValue = value
        this.#nextValue = nextValue !== undefined ? nextValue : value
        this.#backwards = backwards
        this.#getter = getter
        this.#endFn = endFn

        this.#easing = easing
        this.#duration = duration
        this.#timeLastChange = performance.now()
    }
    set(value) {
        this.#prevValue = this.#currValue
        this.#nextValue = value
        this.#timeLastChange = performance.now()
    }
    get() {
        const now = performance.now()
        let t = ((now - this.#timeLastChange) / this.#duration)
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
}