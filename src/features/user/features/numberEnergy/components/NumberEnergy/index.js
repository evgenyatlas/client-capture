import { classNamesString as cn } from '@vkontakte/vkui/dist/lib/classNames'
import { useStore } from 'effector-react'
import { useState } from 'react'
import { EnergyIcon } from '../../../../../../components/EnergyIcon'
import config from '../../../../../../config'
import { $userColor, $userEnergy, $userEnergyFactor } from '../../../../../user/store'
import { useColor } from '../../../../hooks/useColor'
import { useEnergy } from '../../../../hooks/useEnergy'
import { useEnergyFactor } from '../../../../hooks/useEnergyFactor'
import './NumberEnergy.css'

export function NumberEnergy() {
    const energy = useEnergy()
    const energyFactor = useEnergyFactor()
    const color = useColor()
    return (
        <div className={cn("NumberEnergy", `NumberEnergy_color-${color}`)}>
            <div className="NumberEnergy__Head"></div>
            <div className="NumberEnergy__Body">
                <div
                    className={cn(
                        "NumberEnergy__Energy",
                        //Включаем анимацию заполнения только при положительном множителе
                        { 'NumberEnergy__Energy_fill': energyFactor >= 1 }
                    )}
                    style={{
                        //Длительно анимации заполнения
                        animationDuration: (config().GAME.ENERGY_GET_INTERVAL) + 's',
                        background: color
                    }}
                >
                </div>
                <div className="NumberEnergy__Number">{energy}</div>
            </div>
            <div className={cn("EnergyFactor", { 'EnergyFactor_hidden': !energyFactor })}>
                {+energyFactor.toFixed(2)}XP
            </div>
        </div>
    )
}