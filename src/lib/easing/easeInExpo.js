import { lerp } from "./lerp";

export const easeInExpo = (a, b, t) => {
    return lerp(a, b, t === 0 ? 0 : Math.pow(2, 10 * t - 10))
}