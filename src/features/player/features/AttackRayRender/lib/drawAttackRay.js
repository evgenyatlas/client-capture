import { markCircle } from "../../../../../lib/canvas/markCircle"


export function drawAttackRay(params, beginPath = true) {

    beginPath && params.ctx.beginPath()
    markCircle({
        ctx: params.ctx,
        position: params.position,
        radius: params.radius,
        rotation: params.rotation,
        lengthDeg: params.length,
        antiСlockWise: params.anticlockwise
    })
    params.ctx.strokeStyle = params.color
    params.ctx.lineWidth = params.width

    beginPath && params.ctx.stroke()
}