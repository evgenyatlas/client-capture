import { $userColor, $userEnergy } from "../../../../../user/store"
import { $attackAvail, attackEv, $attackEnergy, $availAttack, setAttackEnergyEv } from "../../store"
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
        let select = false
        const attackBtnElm = ref.current
        const attackEnergyElm = ref.current.children[0]
        attackEnergyElm.style.background = $userColor.getState()
        attackEnergyElm.innerText = $attackEnergy.getState()

        const heightElm = ref.current.clientHeight
        const setTranslateY = (y) => ref.current.style.transform = `translateY(-${(y - heightElm)}px)`
        const setDefaultTranslateY = () => ref.current.style.transform = `translateY(0px)`

        const setEnergy = throttle((energy) => {
            energy = Math.max(Math.min($userEnergy.getState() - 1, energy), 0)
            setAttackEnergyEv(energy)
            attackEnergyElm.innerText = energy
        }, 100)

        const onTouchMove = (e) => {
            let clientY = e.touches[0].clientY
            if (clientY < minY)
                clientY = minY
            if (clientY > maxY)
                clientY = maxY
            const factorEnergy = ((clientY - maxY + 40) / (minY - maxY + 80))
            setEnergy(Math.round($userEnergy.getState() * factorEnergy))
            select = true
            setTranslateY(window.innerHeight - clientY)
            attackBtnElm.classList.add('AttackBtn_drag')
        }

        const onTouchEnd = () => {
            const energy = $attackEnergy.getState()
            if (energy) {
                attackEv(energy)
            }
            setEnergy(0)
            attackBtnElm.classList.remove('AttackBtn_drag')
            setDefaultTranslateY()
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

        attackBtnElm.addEventListener('touchmove', onTouchMove)
        unSubs.push(() => attackBtnElm.removeEventListener('touchmove', onTouchEnd))
        attackBtnElm.addEventListener('touchend', onTouchEnd)
        unSubs.push(() => attackBtnElm.removeEventListener('touchend', onTouchEnd))

        setDefaultTranslateY()

        return () => {
            unSubs.forEach(unSub => unSub())
        }
    }, [ref.current])

    return (
        <button
            ref={ref}
            className="AttackBtn"
        >
            <div className="AttackBtn__AttackEnergy">
            </div>
        </button>
    )
})