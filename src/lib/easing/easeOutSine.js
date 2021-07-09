import { lerp } from "./lerp"

export function easeOutSine(a, b, t) {
    return lerp(
        a,
        b,
        Math.sin((t * Math.PI) / 2)
    )
}
