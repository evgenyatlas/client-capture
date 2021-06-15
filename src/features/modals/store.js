import { createEvent, createStore } from "effector";
import { setPayload } from "../../lib/effectorKit/setPayload";

export const showModal = createEvent()
export const hideModal = createEvent()

export const $activeModal = createStore(null)

$activeModal.on(showModal, setPayload)
$activeModal.reset(hideModal)

// showModal.watch(() => console.log('shOmodal'))
// hideModal.watch(() => console.log('hideModal'))