import { lerp } from "./lerp";

export function easeOutBack(a, b, t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;

    return lerp(a, b, 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2))
}