import { EasingValue } from "../../../lib/canvas/easingValue"
import { reverseEasingLoop } from "../../../lib/easing/reverseEasingLoop"

//Интерполяция Круга Атаки (анимация)
export function createAttackEasing(duration) {
    return new EasingValue({
        value: 0,
        duration: duration,
        backwards: 0,
        easing: reverseEasingLoop
    })
}