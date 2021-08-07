
import './AttackBtn.css'
import { memo, useEffect, useRef, useState } from "react"
import { throttle } from "@vkontakte/vkjs"
import { useStore } from "effector-react"
import config from "../../../../../../config"
import { useColor } from "../../../../hooks/useColor"
import { useUser } from "../../../../hooks/useUser"

const minY = window.innerHeight / 2
const maxY = window.innerHeight - 40
export const AttackBtn = memo(function AttackBtn() {
    const ref = useRef()
    const color = useColor()
    const user = useUser()
    useEffect(() => {
        if (!ref.current) return
        //Высота элемента
        const heightElm = ref.current.clientHeight
        //Массив для подписок которые отчистим при unmount
        let unSubs = []
        //Контейнер для самого элемента
        const attackBtnElm = ref.current
        //Отображения значения
        const attackEnergyElm = ref.current.children[0].children[0]
        //Ставим начальное значения 
        attackEnergyElm.innerText = user.attackEnergy.get()

        //Функции для установки позиции
        const setPos = (y) => ref.current.style.transform = `translateY(-${(y - heightElm)}px)`
        const setDefaultPos = () => ref.current.style.transform = `translateY(0px)`

        //Установка выбранной энергии
        const setEnergy = throttle((energy) => user.setAttackEnergy(energy), 100)

        //Вывод выбранной энергии для атаки
        user.attackEnergy.$store.watch(attackEnergy => attackEnergyElm.innerText = attackEnergy)
        //Установка ожидания
        user.attackReady.$store.watch(turn =>
            turn ?
                attackBtnElm.classList.add('AttackBtn_ready')
                :
                attackBtnElm.classList.remove('AttackBtn_ready')
        )

        const onTouchMove = (e) => {
            let clientY = e.touches[0].clientY
            if (clientY < minY)
                clientY = minY
            if (clientY > maxY)
                clientY = maxY
            const factorEnergy = ((clientY - maxY + 40) / (minY - maxY + 80))
            setEnergy(factorEnergy)
            attackBtnElm.classList.add('AttackBtn_drag')
            setPos(window.innerHeight - clientY)
        }

        const onTouchEnd = () => {
            user.attack()
            attackBtnElm.classList.remove('AttackBtn_drag')
            setDefaultPos()
        }

        attackBtnElm.addEventListener('touchmove', onTouchMove)
        attackBtnElm.addEventListener('touchend', onTouchEnd)

        unSubs.push(() => attackBtnElm.removeEventListener('touchmove', onTouchEnd))
        unSubs.push(() => attackBtnElm.removeEventListener('touchend', onTouchEnd))

        setDefaultPos()

        //Очищаем подписки при unmount
        return () => {
            unSubs.forEach(unSub => unSub())
        }

    }, [ref.current])

    return (
        <button
            ref={ref}
            className="AttackBtn"
        >
            <div style={{ backgroundColor: color }} className="AttackBtn__AttackEnergy">
                <span>0</span>
                <svg viewBox="0 0 36 36" className="circular-chart">
                    <path style={{ stroke: color }} className="circle"
                        d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                </svg>
            </div>
        </button>
    )
})