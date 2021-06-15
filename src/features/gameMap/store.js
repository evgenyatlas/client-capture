import { createEvent, createStore } from "effector";
import { setPayload } from "../../lib/effectorKit/setPayload";

export const changeGameMap = createEvent()

export const $gameMap = createStore(null)

$gameMap.on(changeGameMap, setPayload)