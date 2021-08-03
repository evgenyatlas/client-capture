import { useStore } from "effector-react"
import { $userColor, $userEnergy } from "../../../../../user/store"
import { $attackAvail, attackEv, $attackEnergy, $availAttack, $attackEnergyStyle } from "../../store"
import './AttackBtn.css'
import { useCallback, useMemo, useState } from "react"

const minY = window.innerHeight / 2
const maxY = window.innerHeight - 40
export function AttackBtn() {
    const userEnergy = useStore($userEnergy)
    const avail = useStore($availAttack)

    const [posY, setPosY] = useState(0)
    const [selectEnergy, setEnergy] = useState(1)

    //что бы исключить случайные нажатия
    const [selected, setSelected] = useState(false)

    const onTouchMove = (e) => {
        let clientY = e.touches[0].clientY

        //Границы
        if (clientY < minY)
            clientY = minY
        if (clientY > maxY)
            clientY = maxY
        //Получаем множитель исходя из позиции кнопки (1-0)
        const factorEnergy = ((clientY - maxY) / (minY - maxY + 80))
        setEnergy(Math.round(userEnergy * factorEnergy))
        setPosY(clientY)
        setSelected(true)
    }
    const onTouchEnd = useCallback((e) => {
        //что бы исключить случайные нажатия
        setTimeout(() => {
            setSelected(false)
        }, 10)
        setPosY(0)
    }, [])

    //Что бы выбранная энергия не ушла в 0 и не была больше текущей - 1
    const attackEnergy = Math.max(Math.min(userEnergy - 1, selectEnergy), 1)

    return (
        <button
            className={`AttackBtn ${!avail ? "AttackBtn_disabled" : ''} ${posY ? 'AttackBtn_drag' : ''}`}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ transform: `translateY(${posY || maxY}px)` }}
        >
            <div className="AttackBtn__AttackEnergy" style={$attackEnergyStyle.getState()}>
                {attackEnergy}
            </div>
        </button>
    )
}