import { easeInCubic } from "../../../../lib/easing/easeInCubic"
import { easeOutExpo } from "../../../../lib/easing/easeOutExpo"
import { lerp } from "../../../../lib/easing/lerp"
import { reverseEasingLoop } from "../../../../lib/easing/reverseEasingLoop"
import { toRadians } from "../../../../lib/math/toRadians"
import { drawDirection } from "../../lib/drawDirection"
import { Player } from "../../player"

export class AttackRayRender {
    static STAGES = {
        POINTER: 0,
        ATTACK_READY: 1,
        ATTACK: 2,
        TRANSITION_READY: 3
    }
    static READY_SPEED_ROTATION = 700
    rotation
    #stage = AttackRayRender.STAGES.POINTER
    #readySetTime
    #readyRotation = 0
    #attackSetTime
    #transReadySetTime
    constructor({ rotation, stage = AttackRayRender.STAGES.POINTER }) {
        this.rotation = rotation
        this.setStage(stage)
    }

    setStage(stage) {
        if (this.#stage === AttackRayRender.STAGES.ATTACK)
            return

        switch (stage) {
            case AttackRayRender.STAGES.POINTER:
                if (this.#stage === AttackRayRender.STAGES.ATTACK_READY) {
                    this.#transReadySetTime = performance.now()
                    this.#stage = AttackRayRender.STAGES.TRANSITION_READY
                    return
                }
                this.#stage = AttackRayRender.STAGES.POINTER

                break;
            case AttackRayRender.STAGES.ATTACK_READY:
                this.#stage = AttackRayRender.STAGES.ATTACK_READY
                this.#readySetTime = performance.now()

                break;
            case AttackRayRender.STAGES.ATTACK:
                this.#attackSetTime = performance.now()
                this.#stage = AttackRayRender.STAGES.ATTACK

                break
        }
    }


    #drawTransFromReady = (ctx, position, color, map) => {
        let rotation = this.rotation.get() - map.getBearing()
        const t = (performance.now() - this.#transReadySetTime) / (AttackRayRender.READY_SPEED_ROTATION)
        if (t > 1) {
            this.#stage = AttackRayRender.STAGES.POINTER
            this.#readyRotation = 0
        }

        rotation = rotation + easeOutExpo(this.#readyRotation % 360, 1080, t)

        drawDirection({
            ctx,
            rotation: rotation,
            position,
            length: Player.ATTACK_RAY_LENGTH,
            radius: Player.ATTACK_RAY_RADIUS,
            width: Player.ATTACK_RAY_HEIGHT,
            color
        })
    }


    #drawPointer = (ctx, position, color, map) => {
        let rotation = this.rotation.get() - map.getBearing()

        drawDirection({
            ctx,
            rotation: rotation,
            position,
            length: Player.ATTACK_RAY_LENGTH,
            radius: Player.ATTACK_RAY_RADIUS,
            width: Player.ATTACK_RAY_HEIGHT,
            color
        })
    }

    #drawReady = (ctx, position, color, map) => {
        const rotation = this.rotation.get() - map.getBearing()
        const deltaT = performance.now() - this.#readySetTime
        const t = deltaT % AttackRayRender.READY_SPEED_ROTATION / AttackRayRender.READY_SPEED_ROTATION
        this.#readyRotation = deltaT < AttackRayRender.READY_SPEED_ROTATION ? easeInCubic(0, 1080, t) : lerp(0, 3240, t)

        drawDirection({
            ctx,
            rotation:
                rotation + this.#readyRotation,
            position,
            length: Player.ATTACK_RAY_LENGTH,
            radius: Player.ATTACK_RAY_RADIUS,
            width: Player.ATTACK_RAY_HEIGHT,
            color
        })
    }

    #drawAttack = (ctx, position, color, map) => {
        let rotation = this.rotation.get() - map.getBearing()
        const t = (performance.now() - this.#attackSetTime) / Player.ATACK_TIME
        const pos = reverseEasingLoop(0, Player.ATTACK_DISTANCE, t)
        const length = reverseEasingLoop(1, 1.5, t)
        const radius = reverseEasingLoop(1, 1.5, t)
        if (t > 1) {
            this.#stage = AttackRayRender.STAGES.POINTER
        }
        drawDirection({
            ctx,
            rotation: rotation,
            position: {
                x: position.x + (Math.sin(toRadians(rotation)) * pos),
                y: position.y - (Math.cos(toRadians(rotation)) * pos)
            },
            length: Player.ATTACK_RAY_LENGTH * length,
            radius: Player.ATTACK_RAY_RADIUS * (radius < 1 ? 1 : radius),
            width: Player.ATTACK_RAY_HEIGHT,
            color: color
        })
    }

    render(ctx, position, color, map) {
        switch (this.#stage) {
            case AttackRayRender.STAGES.POINTER:
                this.#drawPointer(ctx, position, color, map)
                break;
            case AttackRayRender.STAGES.ATTACK_READY:
                this.#drawReady(ctx, position, color, map)
                break;
            case AttackRayRender.STAGES.TRANSITION_READY:
                this.#drawTransFromReady(ctx, position, color, map)
                break
            case AttackRayRender.STAGES.ATTACK:
                this.#drawAttack(ctx, position, color, map)
                break;
        }
    }
}

window.AttackRayRender = AttackRayRender