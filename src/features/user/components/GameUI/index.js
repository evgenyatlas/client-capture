import { useStore } from "effector-react"
import { AttackBtn } from "../../features/attackBtn/components/AttackBtn/newIndex"
import { AttackEnergy } from "../../features/AttackEnergy/index.js"
import { DeadNotice } from "../../features/deadNotice/components/DeadNotice"
import { NumberEnergy } from "../../features/numberEnergy/components/NumberEnergy"
import { useIsDead } from "../../hooks/useIsDead"

import './GameUI.css'

export function GameUI() {
    const userDead = useIsDead()
    return (
        <>
            <div className={`GameUI ${userDead ? 'GameUI_hidden' : ''}`}>
                <AttackBtn />
                <NumberEnergy />
                {/* <AttackEnergy /> */}
            </div>
            <DeadNotice />
        </>
    )
}