import { broadcastGeo } from './lib/broadcastGeo'
import { setGeolocation } from './store'

export function initGeolocation() {
    broadcastGeo(setGeolocation)
}