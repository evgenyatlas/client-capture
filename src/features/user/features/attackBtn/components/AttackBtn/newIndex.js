import { useStore } from "effector-react"
import { $userColor, $userEnergy } from "../../../../../user/store"
import { $attackAvail, attackEv, $attackEnergy } from "../../store"
import './AttackBtn.css'
import { useEffect, useRef, useState } from "react"

const minY = window.innerHeight / 2
const maxY = window.innerHeight - 40
export function AttackBtn() {
    const ref = useRef()
    useEffect(() => {
        if (!ref.current) return

    }, [ref.current])

    return (
        <div ref={ref}>

        </div>
    )
}