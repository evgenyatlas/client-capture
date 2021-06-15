import { useStore } from "effector-react"
import { $userColor, $userEnergy } from "../../../../../user/store"
import { $attackAvail, attackEv, $attackEnergy } from "../../store"
import './AttackBtn.css'
import { useState } from "react"
import { useDragSelectEnergy } from "./useDragSelectEnergy"

export function AttackBtn() {
    const color = useStore($userColor)
    const userEnergy = useStore($userEnergy)
    const avail = useStore($attackAvail) && userEnergy > 1

    const { className, attackEnergy, ...bind } = useDragSelectEnergy(userEnergy)

    return (
        <button
            disabled={!avail}
            className={`AttackBtn ${!avail ? "AttackBtn_disabled" : ''} ${className}`}
            onClick={avail ? () => attackEv(attackEnergy) : undefined}
            {...bind}
        >
            <div className="AttackBtn__AttackEnergy" style={{ background: color }}>
                {attackEnergy}
            </div>
        </button>
    )
}