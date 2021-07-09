import config from '../../../config'
import { delay } from "../../../lib/async/delay"
import { createGetCurrGeo } from "./createGetCurrGeo"


export async function broadcastGeo(fn) {

    const init = async () => {
        await delay(config().TIMEOUT_GEO_BROADCAST)
        const getCurrGeo = createGetCurrGeo()
        await getCurrGeo()
        return getCurrGeo
    }

    const broadcast = async (getCurrGeo) => {
        while (1) {
            getCurrGeo().then(fn)
            await delay(config().TIMEOUT_GEO_BROADCAST)
        }
    }

    broadcast(await init())
}