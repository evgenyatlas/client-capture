import { createEvent, createStore } from "effector"
import { setPayload } from "./setPayload"

export default function createInputStore(defaultValue = '') {
    const set = createEvent()
    const clear = createEvent()
    const $store = createStore(defaultValue)
    $store.on(set, setPayload)
    $store.reset(clear)
    return { $store, set, clear }
}