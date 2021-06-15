import { createEvent, forward } from "effector";
import { showModal } from "../modals/store";

export const showGameSettingEv = createEvent()

forward({
    from: showGameSettingEv.map(() => 'gameSetting'),
    to: showModal
})