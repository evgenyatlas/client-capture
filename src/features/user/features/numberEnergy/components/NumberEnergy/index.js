import { classNamesString as cn } from '@vkontakte/vkui/dist/lib/classNames'
import { useStore } from 'effector-react'
import { useMemo, useState } from 'react'
import { EnergyIcon } from '../../../../../../components/EnergyIcon'
import config from '../../../../../../config'
import { RGBA } from '../../../../../../lib/color/RGBA'
import { useColor } from '../../../../hooks/useColor'
import { useEnergy } from '../../../../hooks/useEnergy'
import { useEnergyFactor } from '../../../../hooks/useEnergyFactor'
import './NumberEnergy.css'

function Energy() {
    const energy = useEnergy()
    return (
        <div className="NumberEnergy__Number">{energy}</div>

    )
}

export function NumberEnergy() {
    const energyFactor = useEnergyFactor()
    const color = useColor()
    const transColor = useMemo(() => RGBA.fromStr(color).print(0.6), [color])
    return (
        <div className={cn("NumberEnergy", `NumberEnergy_color-${color}`)}>
            <div className="NumberEnergy__Head"></div>
            <div className="NumberEnergy__Body" style={{ background: transColor }}>
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
                <Energy />
            </div>
            <div className={cn("EnergyFactor", { 'EnergyFactor_hidden': !energyFactor })} style={{ background: color }}>
                {+energyFactor.toFixed(2)}XP
            </div>
        </div>
    )
}