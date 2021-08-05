import { combine, createEvent, createStore, forward } from "effector";
import { delay } from 'patronum/delay'
import { throttle } from "patronum/throttle";
import createSwitchStore from "../../../../lib/effectorKit/createSwitchStore";
import { setPayload } from "../../../../lib/effectorKit/setPayload";
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

//Выбранная энергия для урона
export const $attackEnergy = createStore(0)
$attackEnergy.on(throttle({ source: setAttackEnergyEv, timeout: 100 }), setPayload)


$attackAvail.on(attackEv, () => false)
$attackAvail.on(setAvailAttackEv, () => true)

export const $availAttack = combine($attackAvail, $userEnergy, (avail, energy) => avail && energy > 1)
// export const { $store: $attackReady, on: enableAttackReady, off: disableAttackReady } = createSwitchStore(false)
export const $attackReady = $attackEnergy.map(energy => energy > 0)
export const $attackEnergyStyle = $userColor.map(color => ({ background: color }))

//Делаем возможность атаки недоступной после атаки
delay({
    source: attackEv,
    timeout: Player.ATTACK_TIME,
    target: setAvailAttackEv
})