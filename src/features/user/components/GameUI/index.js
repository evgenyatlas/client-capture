import { useStore } from "effector-react"
import { AttackBtn } from "../../features/attackBtn/components/AttackBtn/index"
import { DeadNotice } from "../../features/deadNotice/components/DeadNotice"
import { NumberEnergy } from "../../features/numberEnergy/components/NumberEnergy"
import { $userDead } from "../../store"

import './GameUI.css'

export function GameUI() {
    const userDead = useStore($userDead)
    return (
        <>
            <div className={`GameUI ${userDead ? 'GameUI_hidden' : ''}`}>
                <AttackBtn />
                <NumberEnergy />
            </div>
            <DeadNotice />
        </>
    )
}