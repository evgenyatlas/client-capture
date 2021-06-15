import { EasingValue } from "../../../lib/canvas/easingValue"

//Интерполяция Круга Атаки (анимация)
export function createAttackEasing(duration) {
    return new EasingValue({
        value: 0,
        duration: duration,
        backwards: 0
    })
}