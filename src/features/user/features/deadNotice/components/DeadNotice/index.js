import { useStore } from "effector-react";
import { $userDead } from "../../../../../user/store";
import './DeadNotice.css'

export function DeadNotice() {
    const isDead = useStore($userDead)
    if (!isDead) return null
    return (
        <div className="DeadNotice">
            ПОТРАЧЕНО
        </div>
    )
}