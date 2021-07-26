import { toRadians } from "../../../lib/math/toRadians"

export function drawDirection(params) {
    let startAngleBar = params.rotation - 90 - params.length / 2
    let endAngleBar = startAngleBar + params.length

    params.ctx.beginPath()
    params.ctx.arc(
        params.position.x,
        params.position.y,
        params.radius,
        toRadians(startAngleBar),
        toRadians(endAngleBar),
        false
    )
    params.ctx.strokeStyle = params.color
    params.ctx.lineWidth = params.width
    params.ctx.stroke()
}