import { lerp } from "./lerp"

export function reverseEasing(
    a: number,
    b: number,
    t: number,
    reverseT: number = 0.5,
    easing: Function = lerp
): number {
    return (
        t < reverseT ?
            easing(a, b, t / reverseT)
            :
            easing(b, a, (t - reverseT) / (1 - reverseT))
    )
}