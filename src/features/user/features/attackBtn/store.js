import { combine, createEvent, createStore, forward } from "effector";
import { delay } from 'patronum/delay'
import { throttle } from "patronum/throttle";
import createSwitchStore from "../../../../lib/effectorKit/createSwitchStore";
import { setPayload } from "../../../../lib/effectorKit/setPayload";
import { Player } from "../../../player/player";
import { $userColor, $userEnergy } from "../../store";

/*События*/
export const attackEv = createEvent()
//Установка урона
export const setAttackEnergyEv = createEvent()
/****/

//Выбранная энергия для урона
export const $attackEnergy = createStore(0)
$attackEnergy.on(throttle({ source: setAttackEnergyEv, timeout: 100 }), setPayload)

// export const { $store: $attackReady, on: enableAttackReady, off: disableAttackReady } = createSwitchStore(false)
export const $attackEnergyStyle = $userColor.map(color => ({ background: color }))

