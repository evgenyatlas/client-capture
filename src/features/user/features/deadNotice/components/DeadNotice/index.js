import { useIsDead } from "../../../../hooks/useIsDead";
import './DeadNotice.css'

export function DeadNotice() {
    const isDead = useIsDead()
    if (!isDead) return null
    return (
        <div className="DeadNotice">
            ПОТРАЧЕНО
        </div>
    )
}