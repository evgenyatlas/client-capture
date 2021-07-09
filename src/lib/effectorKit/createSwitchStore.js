import { createEvent, createStore } from "effector"

export default function createSwitchStore(defaultValue = false) {
    const on = createEvent()
    const off = createEvent()
    const toggle = createEvent()
    const $store = createStore(defaultValue)
    $store.on(on, () => true)
    $store.on(off, () => false)
    $store.on(toggle, (state) => !state)
    return { $store, on, off, toggle }
}