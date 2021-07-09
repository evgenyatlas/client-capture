import { combine, createEvent, createStore, forward } from "effector";
import { delay } from 'patronum/delay'
import { Player } from "../../../player/player";
import { $userColor, $userEnergy } from "../../store";

/*События*/
export const attackEv = createEvent()
//Включения доступности/недоступности атаки
const setAvailAttackEv = createEvent()
//Установка урона
export const setAttackEnergyEv = createEvent()
/****/

export const $attackAvail = createStore(true)

$attackAvail.on(attackEv, () => false)
$attackAvail.on(setAvailAttackEv, () => true)

export const $availAttack = combine($attackAvail, $userEnergy, (avail, energy) => avail && energy > 1)

export const $attackEnergyStyle = $userColor.map(color => ({ background: color }))

//Делаем возможность атаки недоступной после атаки
delay({
    source: attackEv,
    timeout: Player.ATACK_TIME,
    target: setAvailAttackEv
})