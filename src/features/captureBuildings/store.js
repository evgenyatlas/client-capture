import { createEffect, createEvent, createStore, forward } from "effector";
import { setPayload } from "../../lib/effectorKit/setPayload";
import { hideModal, showModal } from "../modals/store";

export const $minCaptureDistance = createStore(50)

export const selectBuildingEv = createEvent()
export const hideBuildingInfo = hideModal

export const captureBuildingEv = createEvent()

export const $selectedBuilding = createStore({

})

$selectedBuilding.on(selectBuildingEv, setPayload)
$selectedBuilding.reset(hideBuildingInfo)

forward({
    from: selectBuildingEv.map(() => 'buildingInfo'),
    to: showModal
})

window.createEvent = createEvent