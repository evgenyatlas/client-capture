import { reverseEasing } from "../../../lib/easing/reverseEasing"
import { rand } from "../../../lib/math/rand"

export class JellyAnim {
    //Нужен для того, что бы у всех игроков анимация начиналась не с одинакового кадра
    #randDelayTime
    #duration
    #savedPosition
    scale = [1, 1]
    constructor({ playerPosition, duration = 1500 }) {
        this.#duration = duration
        this.#randDelayTime = rand(0, this.#duration)
    }
    start(ctx, position) {
        this.#savedPosition = { ...position }
        ctx.save()
        const now = performance.now()
        const t = (now + this.#randDelayTime) % this.#duration / this.#duration
        this.scale = [reverseEasing(1.05, 0.95, t), reverseEasing(1, 1.1, t)]
        ctx.scale(this.scale[0], this.scale[1])

        position.x = position.x / this.scale[0]
        position.y = position.y / this.scale[1]
    }
    stop(ctx, position) {
        position.x = this.#savedPosition.x
        position.y = this.#savedPosition.y
        ctx.restore()
    }
}
