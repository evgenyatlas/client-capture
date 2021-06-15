import { createEvent, createStore, forward, guard, sample } from "effector";
import { rgb2hex } from "../../lib/color/rgb2hex";
import { setPayload } from "../../lib/effectorKit/setPayload";
import { $selectedBuilding, captureBuildingEv } from "../captureBuildings/store";
import { hideModal } from "../modals/store";

export const setUserEv = createEvent()
export const updateEnergyEv = createEvent()
export const updateEnergyFactorEv = createEvent()
//События захвата здания нашего пользователя (фильтурем из всех событий захвата)
export const captureBuildingUserEv = captureBuildingEv.filter({
    fn: ({ player: { id } }) => id === $userId.getState()
})

export const $user = createStore({})
export const $userId = $user.map(({ player }) => player ? player.id : '')
export const $userColor = $user.map(({ player }) => player ? rgb2hex(player.color) : undefined)
export const $userEnergy = $user.map(({ player }) => player ? player.energy : 1)
export const $userEnergyFactor = $user.map(({ player }) => player ? player.energyFactor : 0)
export const $userDead = $userEnergy.map(energy => energy <= 0)

$userEnergy.on(updateEnergyEv, (energy, addedEnergy) => energy + addedEnergy)
$userEnergyFactor.on(updateEnergyFactorEv, (energyFactor, addedEnergyFactor) => +((energyFactor + addedEnergyFactor).toFixed(2)))
$user.on(setUserEv, setPayload)

//При захвата текущим пользователем скрываем модалку с описанием строения
forward({
    from: captureBuildingUserEv,
    to: hideModal
})

//При захвате строения обновляем множитель энергии
forward({
    from: captureBuildingUserEv.map(({ building: { energyFactor } }) => energyFactor),
    to: updateEnergyFactorEv
})