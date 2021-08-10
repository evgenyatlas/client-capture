import { ComposeRender } from "../../../../lib/canvas/composeRender"
import { getPosArc } from "../../../../lib/canvas/getPosArc"
import { replaceAlphaRgba } from "../../../../lib/color/replaceAlphaRgba"
import { RGBA } from "../../../../lib/color/RGBA"
import { easeInCubic } from "../../../../lib/easing/easeInCubic"
import { easeOutExpo } from "../../../../lib/easing/easeOutExpo"
import { lerp } from "../../../../lib/easing/lerp"
import { reverseEasing } from "../../../../lib/easing/reverseEasing"
import { toRadians } from "../../../../lib/math/toRadians"
import { drawAttackRay } from "./lib/drawAttackRay"
import { Player } from "../../player"

const lerpDefault = lerp

export class AttackRayRender {
    static STAGES = {
        POINTER: 0,
        ATTACK_READY: 1,
        ATTACK: 2,
        TRANSITION_READY: 3
    }
    static READY_SPEED_ROTATION = 1000
    static ATTACK_SPEED = 500
    #map
    rotation
    position
    #stage = AttackRayRender.STAGES.POINTER
    #readySetTime
    #readyRotation = 0
    #attackSetTime
    // #attackAnim
    #transReadySetTime
    #color
    #rgbaManager
    ctx
    constructor({ ctx, rotation, stage = AttackRayRender.STAGES.POINTER, color, position, map }) {
        this.#color = color
        this.#rgbaManager = RGBA.fromStr(color)
        this.#map = map
        this.rotation = rotation
        this.position = position
        this.setStage(stage)
        // this.#attackAnim = this.#createAttackAnim(ctx)
    }

    // #createAttackAnim = (ctx) => {
    //     // const lerp = easeComparing(lerpDefault)
    //     return new ComposeRender({
    //         ctx,
    //         onDone: () => this.#stage = AttackRayRender.STAGES.POINTER,
    //         steps: [
    //             {
    //                 "state": {
    //                     "rayPos": 0,
    //                     "rayRad": 0,
    //                     "wavePos": 0,
    //                     "waveRad": 0,
    //                     "alphaColWave": 0
    //                 },
    //                 "duration": 200
    //             },
    //             {
    //                 "state": {
    //                     "rayPos": Player.ATTACK_DISTANCE,
    //                     "rayRad": 1.5,
    //                     "wavePos": Player.ATTACK_DISTANCE,
    //                     "waveRad": 1.5,
    //                     "alphaColWave": 0.7
    //                 },
    //                 "duration": 300
    //             },
    //             {
    //                 "state": {
    //                     "rayPos": 0,
    //                     "rayRad": 1,
    //                     "wavePos": Player.ATTACK_DISTANCE,
    //                     "waveRad": 1.5,
    //                     "alphaColWave": 0.7
    //                 },
    //                 "duration": 300
    //             },
    //             {
    //                 "state": {
    //                     "rayPos": 0,
    //                     "rayRad": 1,
    //                     "wavePos": Player.ATTACK_DISTANCE,
    //                     "waveRad": 1.5,
    //                     "alphaColWave": 0
    //                 },
    //                 "duration": 1000
    //             }
    //         ],
    //         easing: function (prevState, nextState, t) {
    //             console.log('easing', prevState, nextState, t)
    //             return {
    //                 "rayPos": lerp(prevState.rayPos, nextState.rayPos, t),
    //                 "rayRad": lerp(prevState.rayRad, nextState.rayRad, t),
    //                 "wavePos": lerp(prevState.wavePos, nextState.wavePos, t),
    //                 "waveRad": lerp(prevState.waveRad, nextState.waveRad, t),
    //                 "alphaColWave": lerp(prevState.alphaColWave, nextState.alphaColWave, t)
    //             }
    //         },
    //         render: (ctx, state, data, position) => {
    //             let rotation = this.rotation.get() - this.#map.getBearing()
    //             const alphaColWave = state.alphaColWave
    //             const wavePos = state.wavePos
    //             const waveRad = state.waveRad
    //             const rayPos = state.rayPos
    //             const rayRad = state.rayRad

    //             console.log('currState', state)
    //             ctx.beginPath()
    //             drawAttackRay({
    //                 ctx,
    //                 rotation: rotation,
    //                 position,
    //                 length: Player.ATTACK_RAY_LENGTH,
    //                 radius: Player.ATTACK_RAY_RADIUS,
    //                 width: Player.ATTACK_RAY_HEIGHT,
    //             }, false)

    //             ctx.moveTo(
    //                 ...getPosArc(
    //                     position.x,
    //                     position.y,
    //                     Player.ATTACK_RAY_RADIUS,
    //                     toRadians((rotation - 90 - Player.ATTACK_RAY_LENGTH / 2) + Player.ATTACK_RAY_LENGTH)
    //                 )
    //             )

    //             ctx.lineTo(
    //                 ...getPosArc(
    //                     position.x + (Math.sin(toRadians(rotation)) * wavePos),
    //                     position.y - (Math.cos(toRadians(rotation)) * wavePos),
    //                     Player.ATTACK_RAY_RADIUS * waveRad,
    //                     toRadians((rotation - 90 - Player.ATTACK_RAY_LENGTH / 2) + Player.ATTACK_RAY_LENGTH)
    //                 )
    //             )

    //             drawAttackRay({
    //                 ctx,
    //                 rotation: rotation,
    //                 position: {
    //                     x: position.x + (Math.sin(toRadians(rotation)) * wavePos),
    //                     y: position.y - (Math.cos(toRadians(rotation)) * wavePos)
    //                 },
    //                 length: Player.ATTACK_RAY_LENGTH,
    //                 radius: Player.ATTACK_RAY_RADIUS * waveRad,
    //                 width: Player.ATTACK_RAY_HEIGHT,
    //                 anticlockwise: true
    //             }, false)

    //             ctx.lineTo(
    //                 ...getPosArc(
    //                     position.x + (Math.sin(toRadians(rotation)) * wavePos),
    //                     position.y - (Math.cos(toRadians(rotation)) * wavePos),
    //                     Player.ATTACK_RAY_RADIUS * waveRad,
    //                     toRadians(rotation - 90 - Player.ATTACK_RAY_LENGTH / 2)
    //                 )
    //             )

    //             ctx.lineTo(
    //                 ...getPosArc(
    //                     position.x,
    //                     position.y,
    //                     Player.ATTACK_RAY_RADIUS,
    //                     toRadians(rotation - 90 - Player.ATTACK_RAY_LENGTH / 2)
    //                 )
    //             )

    //             ctx.fillStyle = this.#rgbaManager.print(alphaColWave)
    //             ctx.fill()
    //             ctx.closePath()

    //             drawAttackRay({
    //                 ctx,
    //                 rotation: rotation,
    //                 position: {
    //                     x: position.x + (Math.sin(toRadians(rotation)) * rayPos),
    //                     y: position.y - (Math.cos(toRadians(rotation)) * rayPos)
    //                 },
    //                 length: Player.ATTACK_RAY_LENGTH,
    //                 radius: Player.ATTACK_RAY_RADIUS * rayRad,
    //                 width: Player.ATTACK_RAY_HEIGHT,
    //                 color: this.#color
    //             })
    //         }
    //     })
    // }

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
                // this.#attackAnim.start()
                this.#stage = AttackRayRender.STAGES.ATTACK

                break
        }
    }


    #drawTransFromReady = (ctx, position, color, map) => {
        let rotation = this.rotation.get() - this.#map.getBearing()
        const t = (performance.now() - this.#transReadySetTime) / (AttackRayRender.READY_SPEED_ROTATION)
        if (t > 1) {
            this.#stage = AttackRayRender.STAGES.POINTER
            this.#readyRotation = 0
        }

        rotation = rotation + easeOutExpo(this.#readyRotation % 360, 1080, t)

        drawAttackRay({
            ctx,
            rotation: rotation,
            position,
            length: Player.ATTACK_RAY_LENGTH,
            radius: Player.ATTACK_RAY_RADIUS,
            width: Player.ATTACK_RAY_HEIGHT,
            color: this.#color
        })
    }


    #drawPointer = (ctx, position, color, map) => {
        let rotation = this.rotation.get() - map.getBearing()
        drawAttackRay({
            ctx,
            rotation: rotation,
            position,
            length: Player.ATTACK_RAY_LENGTH,
            radius: Player.ATTACK_RAY_RADIUS,
            width: Player.ATTACK_RAY_HEIGHT,
            color: this.#color
        })
    }

    #drawReady = (ctx, position, color, map) => {
        const rotation = this.rotation.get() - map.getBearing()
        const deltaT = performance.now() - this.#readySetTime
        const t = deltaT % AttackRayRender.READY_SPEED_ROTATION / AttackRayRender.READY_SPEED_ROTATION
        this.#readyRotation = deltaT < AttackRayRender.READY_SPEED_ROTATION ? easeInCubic(0, 1080, t) : lerp(0, 3240, t)

        drawAttackRay({
            ctx,
            rotation:
                rotation + this.#readyRotation,
            position,
            length: Player.ATTACK_RAY_LENGTH,
            radius: Player.ATTACK_RAY_RADIUS,
            width: Player.ATTACK_RAY_HEIGHT,
            color: this.#color
        })
    }

    #drawAttack = (ctx, position, color, map) => {
        // this.#attackAnim.render(position)
        let rotation = this.rotation.get() - map.getBearing()
        const t = (performance.now() - this.#attackSetTime) / AttackRayRender.ATTACK_SPEED
        const pos = reverseEasing(0, Player.ATTACK_DISTANCE, t, 0.5)
        const radius = reverseEasing(1, 1.5, t, 0.5)

        if (t > 1) {
            this.#stage = AttackRayRender.STAGES.POINTER
        }

        const countRay = ~~(pos / (Player.ATTACK_RAY_HEIGHT))
        for (let i = 0; i < countRay; i++) {
            const pos = i * (Player.ATTACK_RAY_HEIGHT * 1.5)
            const t = pos / Player.ATTACK_DISTANCE
            const radius = lerp(1, 1.5, t)
            const color = this.#rgbaManager.print(lerp(0.1, 0.8, t))
            drawAttackRay({
                ctx,
                rotation: rotation,
                position: {
                    x: position.x + (Math.sin(toRadians(rotation)) * pos),
                    y: position.y - (Math.cos(toRadians(rotation)) * pos)
                },
                length: Player.ATTACK_RAY_LENGTH,
                radius: Player.ATTACK_RAY_RADIUS * (radius < 1 ? 1 : radius),
                width: Player.ATTACK_RAY_HEIGHT,
                color
            })
        }

        drawAttackRay({
            ctx,
            rotation: rotation,
            position: {
                x: position.x + (Math.sin(toRadians(rotation)) * pos),
                y: position.y - (Math.cos(toRadians(rotation)) * pos)
            },
            length: Player.ATTACK_RAY_LENGTH,
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