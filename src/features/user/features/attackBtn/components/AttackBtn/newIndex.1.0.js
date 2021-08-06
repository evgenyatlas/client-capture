import { useStore } from "effector-react"
import { $userColor, $userEnergy } from "../../../../../user/store"
import { $attackAvail, attackEv, $attackEnergy, $availAttack, $attackEnergyStyle, setAttackEnergyEv } from "../../store"
import './AttackBtn.css'
import { useCallback, useMemo, useState, memo } from "react"
import { useEnergy } from "../../../../hooks/useEnergy"

const minY = window.innerHeight / 2
const maxY = window.innerHeight - 40

const AttackEnergy = memo(function AttackEnergy({ color, attackEnergy }) {
    return (
        <div style={{ backgroundColor: color }} className="AttackBtn__AttackEnergy">
            <span>{attackEnergy}</span>
            <svg viewBox="0 0 36 36" className="circular-chart">
                <path style={{ stroke: color }} className="circle"
                    d="M18 2.0845
a 15.9155 15.9155 0 0 1 0 31.831
a 15.9155 15.9155 0 0 1 0 -31.831"
                />
            </svg>
        </div>
    )
})

export function AttackBtn() {
    const userEnergy = useEnergy()
    const color = useStore($userColor)
    const selectEnergy = useStore($attackEnergy)

    const [posY, setPosY] = useState(0)

    const onTouchMove = useCallback((e) => {
        let clientY = e.touches[0].clientY
        if (clientY < minY)
            clientY = minY
        if (clientY > maxY)
            clientY = maxY
        const factorEnergy = ((clientY - maxY + 40) / (minY - maxY + 80))
        setAttackEnergyEv(Math.round($userEnergy.getState() * factorEnergy))
        setPosY(window.innerHeight - clientY - 66)
    }, [])

    const onTouchEnd = useCallback((e) => {
        let energy = $attackEnergy.getState()
        energy = Math.max(Math.min($userEnergy - 1, selectEnergy), 0)
        if (energy) {
            attackEv(energy)
        }
        setAttackEnergyEv(0)
        setPosY(0)
    }, [])

    //Что бы выбранная энергия не ушла в 0 и не была больше текущей - 1
    const attackEnergy = Math.max(Math.min(userEnergy - 1, selectEnergy), 0)

    return (
        <button
            className={`AttackBtn ${attackEnergy && posY ? 'AttackBtn_drag' : ''}`}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ transform: `translateY(-${posY}px)` }}
        >
            <AttackEnergy color={color} attackEnergy={attackEnergy} />
        </button>
    )
}

