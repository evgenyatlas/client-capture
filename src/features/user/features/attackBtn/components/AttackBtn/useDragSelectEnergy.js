import { useRef, useState } from "react"

const minY = 400
export function useDragSelectEnergy(userEnergy) {
    const ref = useRef()
    const [posY, setPosY] = useState(0)
    const [selectEnergy, setEnergy] = useState(1)

    const startY = window.innerHeight - 40
    const onTouchMove = (e) => {
        let clientY = e.touches[0].clientY
        //Границы
        if (clientY < 400)
            clientY = 400
        if (clientY > startY)
            clientY = startY
        //Множитель
        const factorEnergy = ((clientY - startY) / (minY - startY))
        setEnergy(Math.round(userEnergy * factorEnergy))
        setPosY(clientY)
    }
    const onTouchEnd = () => {
        setPosY(0)
    }

    return {
        ref,
        onTouchMove,
        onTouchEnd,
        style: { transform: `translateY(${posY || startY}px)` },
        className: posY ? 'AttackBtn_drag' : '',
        //Что бы выбранная энергия не ушла в 0 и больше доступной - 1
        attackEnergy: Math.max(Math.min(userEnergy - 1, selectEnergy), 1)
    }
}
