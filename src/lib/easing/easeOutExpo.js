import { lerp } from "./lerp"

export function easeOutExpo(a, b, t) {
    return lerp(
        a,
        b,
        t === 1 ?
            1
            :
            1 - Math.pow(2, -10 * t)
    )
}
