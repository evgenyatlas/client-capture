import { EasingValue } from "../../../lib/canvas/easingValue"

//Интерполяция позиции (анимация)
export function createPositionEasing(position) {
    return new EasingValue({
        value: position,
        getter: (prevValue, nextValue, t, easing) => {
            //Если разница слишком большая, то отменняем интерполяцию (для избежания скачков при старте из [0,0] в [N,N])
            if (Math.abs(prevValue[0] - nextValue[0]) > 0.05 || Math.abs(prevValue[1] - nextValue[1]) > 0.5)
                return nextValue
            let result = [
                easing(prevValue[0], nextValue[0], t),
                easing(prevValue[1], nextValue[1], t)
            ]
            return result
        },
        duration: 800
    })
}