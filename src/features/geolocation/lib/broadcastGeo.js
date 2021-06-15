import { delay } from "../../../lib/async/delay"
import { createGetCurrGeo } from "./createGetCurrGeo"

export async function broadcastGeo(fn) {
    await delay(1000)
    const getCurrGeo = createGetCurrGeo()
    await getCurrGeo()
    while (1) {
        getCurrGeo().then(fn)
        await delay(1000)
    }
}