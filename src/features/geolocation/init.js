import { broadcastGeo } from './lib/broadcastGeo'
import { setGeolocation } from './store'

export async function initGeolocation() {
    await broadcastGeo(setGeolocation)
}