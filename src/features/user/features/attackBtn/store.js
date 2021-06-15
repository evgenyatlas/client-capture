import { createEvent, createStore, forward } from "effector";
import { delay } from 'patronum/delay'
import { Player } from "../../../player/player";

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


//Делаем возможность атаки недоступной после атаки
delay({
    source: attackEv,
    timeout: Player.ATACK_TIME,
    target: setAvailAttackEv
})