import { reverseEasingLoop } from "../../../lib/easing/reverseEasingLoop"
import { rand } from "../../../lib/math/rand"

export class JellyAnim {
    //Нужен для того, что бы у всех игроков анимация начиналась не с одинакового кадра
    #randDelayTime
    #playerPosition
    #duration
    scale = [1, 1]
    constructor({ playerPosition, duration = 1500 }) {
        this.#playerPosition = playerPosition
        this.#duration = duration
        this.#randDelayTime = rand(0, this.#duration)
    }
    start(ctx) {
        ctx.save()
        const now = performance.now()
        const t = (now + this.#randDelayTime) % this.#duration / this.#duration
        this.scale = [reverseEasingLoop(1.05, 0.85, t), reverseEasingLoop(1, 1.2, t)]
        ctx.scale(this.scale[0], this.scale[1])
    }
    stop(ctx) {
        ctx.restore()
    }
}
