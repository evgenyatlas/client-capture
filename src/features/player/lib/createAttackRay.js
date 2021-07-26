import { ComposeRender } from "../../../lib/canvas/composeRender"
import { easeComparing } from "../../../lib/easing/easeComparing"
import { easeInCubic as easeInCubicDefault } from "../../../lib/easing/easeInCubic"
import { lerp as lerpDefault } from "../../../lib/easing/lerp"
import { toRadians } from "../../../lib/math/toRadians"
import { drawDirection } from "./drawDirection"

const lerp = easeComparing(lerpDefault)
const easeInCubic = easeComparing(easeInCubicDefault)

export function createAttackRay({ ctx, attackDistance, rotation, map, length, width, color, radius }) {
    return new ComposeRender({
        ctx,
        data: {
            rotation,
            map,
            length,
            width,
            color,
            radius
        },
        steps: [
            {
                state: {
                    rotation: 0,
                    posX: 0,
                    posY: 0,
                    length: 1,
                    radius: 1
                },
                duration: 0
            },
            {
                state: {
                    rotation: 0,
                    posX: attackDistance,
                    posY: attackDistance,
                    length: 1.5,
                    radius: 1.5,
                },
                duration: 200
            },
            {
                state: {
                    rotation: 0,
                    posX: 0,
                    posY: 0,
                    length: 1,
                    radius: 1
                },
                duration: 200
            }

        ],
        easing: function (prevState, nextState, t) {
            return {
                rotation: easeInCubic(prevState.rotation, nextState.rotation, t),
                posX: lerp(prevState.posX, nextState.posX, t),
                posY: lerp(prevState.posY, nextState.posY, t),
                length: lerp(prevState.length, nextState.length, t),
                radius: lerp(prevState.radius, nextState.radius, t)
            }
        },
        render: (ctx, state, data, position) => {
            const rotation = Math.round(data.rotation.get()) - Math.round(data.map.getBearing())
            const smoothRotation = rotation % 360
            let factor
            if (Math.abs(smoothRotation) < 90)
                factor = Math.pow(Math.cos(60) * smoothRotation / 90, 2)
            else factor = 1
            console.log(factor, rotation, smoothRotation, data.rotation.get(), data.map.getBearing())
            factor = 1
            // if (smoothRotation == 0)
            //     factor = Math.pow(Math.cos(toRadians(60)), 2)
            // if (Math.abs(smoothRotation) > 30 && Math.abs(smoothRotation) < 60) {
            //     factor = Math.pow(Math.sqrt(3) / 4, 2)
            // } 

            drawDirection({
                ctx,
                rotation: rotation + state.rotation,
                position: {
                    x: position.x + (Math.sin(toRadians(rotation)) * (state.posX * factor)),
                    y: position.y - (Math.cos(toRadians(rotation)) * (state.posY * factor))
                },
                length: data.length,
                radius: data.radius * state.radius,
                width: data.width,
                color: data.color
            })
        }
    })
}