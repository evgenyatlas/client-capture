import { createEvent, createStore } from "effector"
import { throttle } from 'patronum/throttle'

export const setFpsEv = createEvent()
export const $fps = createStore(0)
const setFps = throttle({
    source: setFpsEv,
    timeout: 1500,
})
// $lastCall.watch(console.log)
$fps.on(setFps, (state, fps) => fps)