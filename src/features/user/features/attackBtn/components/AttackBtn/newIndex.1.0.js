import { useStore } from "effector-react"
import { $userColor, $userEnergy } from "../../../../../user/store"
import { $attackAvail, attackEv, $attackEnergy, $availAttack } from "../../store"
import './AttackBtn.css'
import { memo, useEffect, useRef, useState } from "react"
import { throttle } from "@vkontakte/vkjs"

const minY = window.innerHeight / 2
const maxY = window.innerHeight - 40
export const AttackBtn = memo(function AttackBtn() {
    const ref = useRef()
    useEffect(() => {
        if (!ref.current) return
        let unSubs = []
        let energy = 1
        let select = false
        const attackBtnElm = ref.current
        const attackEnergyElm = ref.current.children[0]
        attackEnergyElm.style.background = $userColor.getState()
        attackEnergyElm.innerText = energy

        const setEnergy = throttle(() => {
            energy = Math.max(Math.min($userEnergy.getState() - 1, energy), 1)
            attackEnergyElm.innerText = energy
        }, 70)

        const attack = () => {
            if (!$availAttack.getState() || select) return
            attackEv(energy)
        }

        const onTouchMove = (e) => {
            let clientY = e.touches[0].clientY
            if (clientY < minY)
                clientY = minY
            if (clientY > maxY)
                clientY = maxY
            const factorEnergy = ((clientY - maxY) / (minY - maxY + 80))
            energy = Math.round($userEnergy.getState() * factorEnergy)
            setEnergy(energy)
            select = true
            attackBtnElm.style.transform = `translateY(${clientY}px)`
            attackBtnElm.classList.add('AttackBtn_drag')
        }

        const onTouchEnd = () => {
            attackBtnElm.classList.remove('AttackBtn_drag')
            attackBtnElm.style.transform = `translateY(${maxY}px)`
            setTimeout(() => select = false, 10)
        }

        const setAvail = (avail) => {
            if (avail && attackBtnElm.classList.contains('AttackBtn_disabled')) {
                attackBtnElm.classList.remove('AttackBtn_disabled')
            }
            else if (!avail && !attackBtnElm.classList.contains('AttackBtn_disabled')) {
                attackBtnElm.classList.add('AttackBtn_disabled')
            }
        }

        unSubs.push($availAttack.watch(setAvail).unsubscribe)
        unSubs.push($userEnergy.watch(setEnergy).unsubscribe)

        attackBtnElm.addEventListener('touchmove', onTouchMove)
        unSubs.push(() => attackBtnElm.removeEventListener('touchmove', onTouchEnd))
        attackBtnElm.addEventListener('touchend', onTouchEnd)
        unSubs.push(() => attackBtnElm.removeEventListener('touchend', onTouchEnd))
        attackBtnElm.addEventListener('click', attack)
        unSubs.push(() => attackBtnElm.removeEventListener('click', attack))


        return () => {
            unSubs.forEach(unSub => unSub())
        }
    }, [ref.current])

    return (
        <button
            ref={ref}
            className={`AttackBtn`}
            style={{ transform: `translateY(${maxY}px)` }}
        >
            <div className="AttackBtn__AttackEnergy">
            </div>
        </button>
    )
})