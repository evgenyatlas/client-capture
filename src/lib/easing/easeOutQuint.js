import { lerp } from "./lerp"

export function easeOutQuint(a, b, t) {
    return lerp(
        a,
        b,
        1 - Math.pow(1 - t, 5)
    )
}
