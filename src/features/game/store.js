import { createEvent, createStore } from "effector";
import { setPayload } from "../../lib/effectorKit/setPayload";

export const changeGameStatus = createEvent()

export const $gameStatus = createStore()

$gameStatus.on(changeGameStatus, setPayload)