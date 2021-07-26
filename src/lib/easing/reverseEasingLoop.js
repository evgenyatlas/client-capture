import { lerp } from "./lerp"

export const reverseEasingLoop = (a, b, t, easing = lerp) => t < 0.5 ?
    easing(a, b, t / 0.5)
    :
    easing(b, a, (t - 0.5) / 0.5)