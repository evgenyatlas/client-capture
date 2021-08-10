type Vector2D = [number, number]

export function getPosArc(x: number, y: number, radius: number, angle: number): Vector2D {
    return [
        x + Math.cos(angle) * radius,
        y + Math.sin(angle) * radius
    ]
}