import { useStore } from 'effector-react'
import { $attackEnergy } from '../attackBtn/store'
import './AttackEnergy.css'

export function AttackEnergy() {
    const energy = useStore($attackEnergy)
    return (
        energy ?
            <div className="AttackEnergy">
                <div className="AttackEnergy__Text">
                    {energy}
                </div>
            </div>
            :
            null
    )
}