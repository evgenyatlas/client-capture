import { reverseEasing } from "../../../lib/easing/reverseEasing"
import { rand } from "../../../lib/math/rand"

export class Effects {
    //Нужен для того, что бы у всех игроков анимация начиналась не с одинакового кадра
    private randDelayTime: number
    private duration: number
    private savedPosition!: Position
    private scale: Vector2D = [1, 1]
    private ctx: CanvasRenderingContext2D
    constructor({ duration = 1500, ctx }: { duration: number, ctx: CanvasRenderingContext2D }) {
        this.duration = duration
        this.ctx = ctx
        this.randDelayTime = rand(0, this.duration)
    }
    run(position: Position, dead: boolean) {
        this.runJelly(position)
        if (dead)
            this.runDead()
    }
    stop(position: Position, dead: boolean) {
        this.stopJelly(position)
        if (dead)
            this.stopDead()
    }
    /**
     * Эффект срабатывает, когда персонаж мертв
     */
    private runDead() {
        this.ctx.globalAlpha = 0.6
    }
    private stopDead() {
        this.ctx.globalAlpha = 1
    }
    /**
     * Эффект поддергивания игрока (желе) 
     */
    private runJelly(position: Position) {
        this.savedPosition = { ...position }
        this.ctx.save()
        const now = performance.now()
        const t = (now + this.randDelayTime) % this.duration / this.duration
        this.scale = [reverseEasing(1.05, 0.95, t), reverseEasing(1, 1.1, t)]
        this.ctx.scale(this.scale[0], this.scale[1])

        position.x = position.x / this.scale[0]
        position.y = position.y / this.scale[1]
    }
    private stopJelly(position: Position) {
        position.x = this.savedPosition.x
        position.y = this.savedPosition.y
        this.ctx.restore()
    }
}
