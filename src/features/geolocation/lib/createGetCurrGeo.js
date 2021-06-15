import transformTranslate from '@turf/transform-translate';
import bridge from '@vkontakte/vk-bridge';
import config from '../../../config';
import { roundGeoArr } from '../../../lib/geo/roundGeo';
import { $gameMap } from '../../gameMap/store';

export function createGetCurrGeo() {
    let getPosition

    if (document.location.search.indexOf('geo-key') > -1) {
        let position = config().DEFAULT_GEO
        document.addEventListener('keydown', ({ keyCode }) => {
            const distance = config().GEOKEY_STEP
            const dictForwardKey = { 38: true, 87: true }

            if (dictForwardKey[keyCode])
                position = transformTranslate(
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: position
                        }
                    },
                    distance,
                    $gameMap.getState().getBearing(),
                    {
                        units: 'meters'
                    }
                ).geometry.coordinates
        })
        getPosition = res => {
            res({ coords: roundGeoArr(position), accuracy: 1 })
        }
    }
    else if (document.location.search.indexOf('vk_user_id') > -1) {
        getPosition = (res, rej) => {
            bridge.send('VKWebAppGetGeodata')
                .then((data) => {
                    if (data.available)
                        res({ coords: roundGeoArr([data.long, data.lat]), accuracy: data.accuracy || 7 })
                })
                .catch(console.error)
        }
    }
    else {
        getPosition = (res, rej) => navigator
            .geolocation
            .getCurrentPosition(
                ({ coords: { longitude, latitude, accuracy } }) => {
                    res({ coords: roundGeoArr([longitude, latitude]), accuracy })
                    // console.log(`Радиус точности в метра: ${accuracy}`)
                },
                rej,
                {
                    enableHighAccuracy: true
                }
            )
    }

    return () => {
        return new Promise((res, rej) => {
            getPosition(res)
        })
    }
}