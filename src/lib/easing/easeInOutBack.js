import { lerp } from "./lerp";

export function easeInOutBack(a, b, t) {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;

    t = t < 0.5
        ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
        : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    lerp(a, b, t)
}