import { toRadians } from "../math/toRadians"

interface Position {
    x: number,
    y: number
}

export function markCircle(params: {
    ctx: CanvasRenderingContext2D,
    position: Position,
    radius: number,
    rotation: number,
    lengthDeg?: number,
    startDeg?: number,
    antiСlockWise?: boolean,
}) {
    params.lengthDeg = params.lengthDeg || 360
    params.startDeg = params.startDeg || 90

    let startAngleBar = params.rotation - params.startDeg - params.lengthDeg / 2
    let endAngleBar = startAngleBar + params.lengthDeg

    if (params.antiСlockWise) [startAngleBar, endAngleBar] = [endAngleBar, startAngleBar]

    // beginPath && params.ctx.beginPath()
    params.ctx.arc(
        params.position.x,
        params.position.y,
        params.radius,
        toRadians(startAngleBar),
        toRadians(endAngleBar),
        params.antiСlockWise || false
    )
    // params.ctx.strokeStyle = params.color
    // params.ctx.lineWidth = params.width
    // beginPath && params.ctx.stroke()
}
