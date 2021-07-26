import { lerp } from "./lerp";

export function easeOutBounce(a, b, t) {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
        t = n1 * t * t;
    } else if (t < 2 / d1) {
        t = n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
        t = n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
        t = n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
    return lerp(a, b, t)
}