import { lerp } from "./lerp";

export function easeInCubic(a, b, t) {
    return lerp(a, b, t * t * t)
}