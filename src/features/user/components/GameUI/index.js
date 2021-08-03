import { useStore } from "effector-react"
import { AttackBtn } from "../../features/attackBtn/components/AttackBtn/newIndex.js"
import { AttackEnergy } from "../../features/AttackEnergy/index.js"
import { DeadNotice } from "../../features/deadNotice/components/DeadNotice"
import { NumberEnergy } from "../../features/numberEnergy/components/NumberEnergy"
import { $userColor, $userDead } from "../../store"

import './GameUI.css'

export function GameUI() {
    const userDead = useStore($userDead)
    const fetching = !useStore($userColor)
    return fetching ? null : (
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