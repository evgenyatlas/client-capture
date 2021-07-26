import { lerp } from "./lerp";

export function easeInSine(a, b, t) {
    return lerp(a, b, 1 - Math.cos((t * Math.PI) / 2))
}